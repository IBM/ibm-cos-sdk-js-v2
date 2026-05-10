$version: "2.0"

namespace smithy.protocols

/// An RPC-based protocol that serializes CBOR payloads.
@protocolDefinition(
    traits: [
        cors
        endpoint
        hostLabel
        httpError
    ]
)
@trait(
    selector: "service"
)
@traitValidators(
    "rpcv2Cbor.NoDocuments": {
        selector: "service ~> member :test(> document)"
        message: "This protocol does not support document types in most possible scenarios."
        severity: "DANGER"
    }
)
structure rpcv2Cbor {
    /// Priority ordered list of supported HTTP protocol versions.
    http: StringList
    /// Priority ordered list of supported HTTP protocol versions
    /// that are required when using event streams.
    eventStreamHttp: StringList
}

/// A list of String shapes.
@private
list StringList {
    member: String
}
