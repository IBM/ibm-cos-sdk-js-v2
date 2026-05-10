/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
package software.amazon.smithy.aws.typescript.codegen.auth.http.integration;

import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;
import software.amazon.smithy.aws.typescript.codegen.AwsDependency;
import software.amazon.smithy.aws.typescript.codegen.AwsTraitsUtils;
import software.amazon.smithy.model.Model;
import software.amazon.smithy.model.shapes.ServiceShape;
import software.amazon.smithy.model.shapes.ShapeId;
import software.amazon.smithy.typescript.codegen.ApplicationProtocol;
import software.amazon.smithy.typescript.codegen.LanguageTarget;
import software.amazon.smithy.typescript.codegen.TypeScriptCodegenContext;
import software.amazon.smithy.typescript.codegen.TypeScriptDependency;
import software.amazon.smithy.typescript.codegen.TypeScriptSettings;
import software.amazon.smithy.typescript.codegen.TypeScriptWriter;
import software.amazon.smithy.typescript.codegen.auth.http.HttpAuthOptionProperty;
import software.amazon.smithy.typescript.codegen.auth.http.HttpAuthScheme;
import software.amazon.smithy.typescript.codegen.auth.http.HttpAuthSchemeParameter;
import software.amazon.smithy.typescript.codegen.auth.http.SupportedHttpAuthSchemesIndex;
import software.amazon.smithy.typescript.codegen.auth.http.integration.HttpAuthTypeScriptIntegration;
import software.amazon.smithy.typescript.codegen.sections.ClientConstructorCodeSection;
import software.amazon.smithy.utils.CodeInterceptor;
import software.amazon.smithy.utils.CodeSection;
import software.amazon.smithy.utils.SmithyInternalApi;

/**
 * Support for @ibm.auth#iam.
 */
@SmithyInternalApi
public final class SupportIbmIamAuth implements HttpAuthTypeScriptIntegration {

    private static final Consumer<TypeScriptWriter> IBM_IAM_AUTH_SIGNER = w -> {
        w.addDependency(AwsDependency.IBM_IAM_SIGNER);
        w.addImport("IbmIamSigner", null, AwsDependency.IBM_IAM_SIGNER);
        w.write("new IbmIamSigner()");
    };

    /**
     * Integration should be always active.
     */
    @Override
    public boolean matchesSettings(TypeScriptSettings settings) {
        return true;
    }

    @Override
    public List<String> runAfter() {
        return List.of(SupportSigV4Auth.class.getCanonicalName());
    }

    @Override
    public Optional<HttpAuthScheme> getHttpAuthScheme() {
        return Optional.of(
            HttpAuthScheme.builder()
                .schemeId(ShapeId.from("ibm.auth#iam"))
                .applicationProtocol(ApplicationProtocol.createDefaultHttpApplicationProtocol())
                .putDefaultSigner(LanguageTarget.SHARED, IBM_IAM_AUTH_SIGNER)
                .addConfigField(SupportSigV4Auth.CREDENTIALS_CONFIG_FIELD)
                .addHttpAuthSchemeParameter(
                    HttpAuthSchemeParameter.builder()
                        .name("region")
                        .type(w -> w.write("string"))
                        .source(w -> {
                            w.addDependency(TypeScriptDependency.UTIL_MIDDLEWARE);
                            w.addImport(
                                "normalizeProvider",
                                null,
                                TypeScriptDependency.UTIL_MIDDLEWARE
                            );
                            w.openBlock(
                                "await normalizeProvider(config.region)() || (() => {",
                                "})()",
                                () -> {
                                    w.write(
                                        "throw new Error(\"expected `region` to be configured for `ibm.auth#iam`\");"
                                    );
                                }
                            );
                        })
                        .build()
                )
                .addHttpAuthOptionProperty(
                    HttpAuthOptionProperty.builder()
                        .name("region")
                        .type(HttpAuthOptionProperty.Type.SIGNING)
                        .source(t -> w -> {
                            w.write("authParameters.region");
                        })
                        .build()
                )
                .propertiesExtractor(
                    s -> w -> w
                        .write("""
                               (config, context) => {
                                 return {
                                   /**
                                    * @internal
                                    */
                                   signingProperties: {
                                     config,
                                     context,
                                   },
                                 };
                               },""")
                )
                .build()
        );
    }

    @Override
    public void customizeSupportedHttpAuthSchemes(
        SupportedHttpAuthSchemesIndex supportedHttpAuthSchemesIndex,
        Model model,
        TypeScriptSettings settings
    ) {
        ServiceShape service = settings.getService(model);
        if (AwsTraitsUtils.isAwsService(service)) {
            HttpAuthScheme authScheme = supportedHttpAuthSchemesIndex.getHttpAuthScheme(ShapeId.from("ibm.auth#iam"));
            if (authScheme != null) {
                supportedHttpAuthSchemesIndex.putHttpAuthScheme(
                    authScheme.getSchemeId(),
                    authScheme.toBuilder()
                        .removeConfigField("credentials")
                        .addConfigField(
                            SupportSigV4Auth.CREDENTIALS_CONFIG_FIELD.toBuilder()
                                .configFieldWriter(null)
                                .build()
                        )
                        .removeHttpAuthSchemeParameter("region")
                        .build()
                );
            }
        }
    }

    @Override
    public List<? extends CodeInterceptor<? extends CodeSection, TypeScriptWriter>> interceptors(
        TypeScriptCodegenContext codegenContext
    ) {
        return List.of(
            new CodeInterceptor<ClientConstructorCodeSection, TypeScriptWriter>() {
                @Override
                public Class<ClientConstructorCodeSection> sectionType() {
                    return ClientConstructorCodeSection.class;
                }

                @Override
                public void write(
                    TypeScriptWriter w,
                    String previousText,
                    ClientConstructorCodeSection s
                ) {
                    if (
                        previousText.contains("\"aws.auth#sigv4\": config.credentials,")
                            && previousText.contains("\"ibm.auth#iam\": config.credentials,")
                    ) {
                        w.addDependency(AwsDependency.IBM_IAM_CREDENTIAL_PROVIDER);
                        w.addImport("iamCredentialProvider", null, AwsDependency.IBM_IAM_CREDENTIAL_PROVIDER);

                        // Use regex to swap and wrap. We capture the leading whitespace to preserve
                        // indentation.
                        // The regex looks for: (whitespace)"aws.auth#sigv4": config.credentials,
                        // followed by a newline and whitespace, then: "ibm.auth#iam":
                        // config.credentials,
                        String regex =
                            "([ \\t]+)\"aws\\.auth#sigv4\": config\\.credentials,\\r?\\n\\s+\"ibm\\.auth#iam\": config\\.credentials,";
                        String replacement =
                            "$1\"ibm.auth#iam\": iamCredentialProvider(config.credentials),\n$1\"aws.auth#sigv4\": config.credentials,";

                        String result = previousText.replaceAll(regex, replacement);

                        // If replaceAll didn't change anything (regex didn't match), fallback to simple
                        // wrap
                        if (result.equals(previousText)) {
                            w.write(
                                previousText.replace(
                                    "\"ibm.auth#iam\": config.credentials",
                                    "\"ibm.auth#iam\": iamCredentialProvider(config.credentials)"
                                )
                            );
                        } else {
                            w.write(result);
                        }
                    } else {
                        w.write(previousText);
                    }
                }
            }
        );
    }
}
