/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
package software.amazon.smithy.aws.typescript.codegen;

import static software.amazon.smithy.typescript.codegen.TypeScriptDependency.NORMAL_DEPENDENCY;
import static software.amazon.smithy.typescript.codegen.TypeScriptDependency.PEER_DEPENDENCY;

import java.io.IOException;
import java.io.StringReader;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import software.amazon.smithy.codegen.core.SymbolDependency;
import software.amazon.smithy.typescript.codegen.Dependency;
import software.amazon.smithy.utils.IoUtils;
import software.amazon.smithy.utils.SmithyInternalApi;

/**
 * This enum should define all TypeScript dependencies that are introduced by
 * this package.
 */
@SmithyInternalApi
public enum AwsDependency implements Dependency {

    AWS_SDK_CORE(NORMAL_DEPENDENCY, "@ibm-cos/core"),
    MIDDLEWARE_SIGNING(NORMAL_DEPENDENCY, "@ibm-cos/middleware-signing"),
    MIDDLEWARE_TOKEN(NORMAL_DEPENDENCY, "@ibm-cos/middleware-token"),
    CREDENTIAL_PROVIDER_NODE(NORMAL_DEPENDENCY, "@ibm-cos/credential-provider-node"),
    ACCEPT_HEADER(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-api-gateway"),
    S3_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-s3"),
    ADD_EXPECT_CONTINUE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-expect-continue"),
    GLACIER_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-glacier"),
    MACHINELEARNING_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-machinelearning"),
    S3_CONTROL_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-s3-control"),
    SSEC_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-ssec"),
    RDS_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-rds"),
    LOCATION_CONSTRAINT(NORMAL_DEPENDENCY, "@ibm-cos/middleware-location-constraint"),
    ROUTE53_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-route53"),
    EC2_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-ec2"),
    BUCKET_ENDPOINT_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-bucket-endpoint"),
    MIDDLEWARE_HOST_HEADER(NORMAL_DEPENDENCY, "@ibm-cos/middleware-host-header"),
    SQS_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-sqs"),
    BODY_CHECKSUM_GENERATOR_BROWSER(NORMAL_DEPENDENCY, "@ibm-cos/body-checksum-browser"),
    BODY_CHECKSUM_GENERATOR_NODE(NORMAL_DEPENDENCY, "@ibm-cos/body-checksum-node"),
    XML_BUILDER(NORMAL_DEPENDENCY, "@ibm-cos/xml-builder"),
    /**
     * @deprecated use SmithyDependency.UUID.
     */
    @Deprecated
    UUID_GENERATOR(NORMAL_DEPENDENCY, "uuid", "^9.0.1"),
    /**
     * @deprecated use SmithyDependency.UUID_TYPES.
     */
    @Deprecated
    UUID_GENERATOR_TYPES(NORMAL_DEPENDENCY, "@types/uuid", "^9.0.1"),
    MIDDLEWARE_EVENTSTREAM(NORMAL_DEPENDENCY, "@ibm-cos/middleware-eventstream"),
    AWS_SDK_EVENTSTREAM_HANDLER_NODE(NORMAL_DEPENDENCY, "@ibm-cos/eventstream-handler-node"),
    TRANSCRIBE_STREAMING_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-transcribe-streaming"),
    STS_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-sdk-sts"),
    STS_CLIENT(NORMAL_DEPENDENCY, "@ibm-cos/client-sts"),
    STS_CLIENT_PEER(PEER_DEPENDENCY, "@ibm-cos/client-sts"),
    SSO_OIDC_CLIENT(NORMAL_DEPENDENCY, "@ibm-cos/client-sso-oidc"),
    MIDDLEWARE_LOGGER(NORMAL_DEPENDENCY, "@ibm-cos/middleware-logger"),
    MIDDLEWARE_USER_AGENT("dependencies", "@ibm-cos/middleware-user-agent"),
    AWS_SDK_UTIL_USER_AGENT_BROWSER(NORMAL_DEPENDENCY, "@ibm-cos/util-user-agent-browser"),
    AWS_SDK_UTIL_USER_AGENT_NODE(NORMAL_DEPENDENCY, "@ibm-cos/util-user-agent-node"),
    MIDDLEWARE_ENDPOINT_DISCOVERY(NORMAL_DEPENDENCY, "@ibm-cos/middleware-endpoint-discovery"),
    AWS_CRYPTO_SHA1_BROWSER(NORMAL_DEPENDENCY, "@aws-crypto/sha1-browser", "5.2.0"),
    SIGNATURE_V4_MULTIREGION(NORMAL_DEPENDENCY, "@ibm-cos/signature-v4-multi-region"),
    RECURSION_DETECTION_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-recursion-detection"),
    MIDDLEWARE_WEBSOCKET(NORMAL_DEPENDENCY, "@ibm-cos/middleware-websocket"),

    // Conditionally added when httpChecksum trait is present
    @Deprecated
    MD5_BROWSER(NORMAL_DEPENDENCY, "@ibm-cos/md5-js", "3.374.0"),
    @Deprecated
    STREAM_HASHER_NODE(NORMAL_DEPENDENCY, "@ibm-cos/hash-stream-node", "3.374.0"),
    @Deprecated
    STREAM_HASHER_BROWSER(NORMAL_DEPENDENCY, "@ibm-cos/hash-blob-browser", "3.374.0"),
    FLEXIBLE_CHECKSUMS_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-flexible-checksums"),

    // Conditionally added when auth trait is present
    MIDDLEWARE_API_KEY(NORMAL_DEPENDENCY, "@ibm-cos/middleware-api-key"),

    // Conditionally added when EndpointRuleSetTrait is present
    UTIL_ENDPOINTS(NORMAL_DEPENDENCY, "@ibm-cos/util-endpoints"),

    // Conditionally added when @httpBearerAuth is used in an AWS service
    TOKEN_PROVIDERS(NORMAL_DEPENDENCY, "@ibm-cos/token-providers"),
    TYPES(NORMAL_DEPENDENCY, "@ibm-cos/types"),
    REGION_CONFIG_RESOLVER(NORMAL_DEPENDENCY, "@ibm-cos/region-config-resolver"),

    CLIENT_DYNAMODB_PEER(PEER_DEPENDENCY, "@ibm-cos/client-dynamodb", "^3.0.0"),
    UTIL_DYNAMODB(NORMAL_DEPENDENCY, "@ibm-cos/util-dynamodb", "*"),
    DYNAMODB_CODEC(NORMAL_DEPENDENCY, "@ibm-cos/dynamodb-codec"),
    IBM_IAM_SIGNER(NORMAL_DEPENDENCY, "@ibm-cos/signature-ibm-iam"),
    IBM_IAM_MIDDLEWARE(NORMAL_DEPENDENCY, "@ibm-cos/middleware-signing-ibm-iam"),
    IBM_IAM_CREDENTIAL_PROVIDER(NORMAL_DEPENDENCY, "@ibm-cos/credential-provider-iam");

    public final String packageName;
    public final String version;
    public final SymbolDependency dependency;

    AwsDependency(String type, String name) {
        this(type, name, SdkVersion.expectVersion(name));
    }

    AwsDependency(String type, String name, String version) {
        this.dependency = SymbolDependency.builder().dependencyType(type).packageName(name).version(version).build();
        this.packageName = name;
        this.version = version;
    }

    @Override
    public List<SymbolDependency> getDependencies() {
        return Collections.singletonList(dependency);
    }

    @Override
    public String getPackageName() {
        return this.packageName;
    }

    private static final class SdkVersion {
        private static final Map<String, String> VERSIONS;

        static {
            String rawProperties = IoUtils.readUtf8Url(AwsDependency.class.getResource("sdkVersions.properties"))
                .trim();
            Properties p = new Properties();
            try {
                p.load(new StringReader(rawProperties));
            } catch (IOException e) {
                throw new IllegalArgumentException("Could not read sdkVersions.properties");
            }

            final Map<String, String> versions = new HashMap<>(p.size());
            p.forEach((k, v) -> {
                if (versions.put(k.toString(), v.toString()) != null) {
                    throw new IllegalArgumentException("Multiple versions defined for " + k.toString());
                }
            });
            VERSIONS = Collections.unmodifiableMap(versions);
        }

        private static String expectVersion(String packageName) {
            if (!VERSIONS.containsKey(packageName)) {
                return "0.0.0-unused";
            }
            return VERSIONS.get(packageName);
        }
    }
}
