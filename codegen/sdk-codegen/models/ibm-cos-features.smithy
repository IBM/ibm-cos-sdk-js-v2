$version: "2.0"

namespace ibm.cos

use aws.protocols#httpChecksum

/// <p>Lists buckets with extended filtering and pagination.</p>
/// <p>Alias in original model: "GetServiceExtended"</p>
@http(
    method: "GET"
    uri: "/?extended"
    code: 200
)
@paginated(
    inputToken: "Marker"
    outputToken: "NextMarker"
    items: "Buckets"
    pageSize: "MaxKeys"
)
operation ListBucketsExtended {
    input: ListBucketsExtendedInput
    output: ListBucketsExtendedOutput
}

@input
structure ListBucketsExtendedInput {
    /// <p>IBM Cloud Service Instance ID associated with the request.</p>
    /// <p>Sent as: Ibm-Service-Instance-Id</p>
    @httpHeader("ibm-service-instance-id")
    IBMServiceInstanceId: String

    /// <p>Pagination marker.</p>
    @httpQuery("marker")
    Marker: Marker

    /// <p>Max number of buckets to return.</p>
    @httpQuery("max-keys")
    MaxKeys: MaxKeys

    /// <p>Filter by bucket name prefix.</p>
    @httpQuery("prefix")
    Prefix: Prefix
}

/// <p>REST-XML result structure.</p>
/// <p>The entire output is serialized as the document body in REST-XML.</p>
@output
@xmlName("ListAllMyBucketsExtendedResult")
@xmlNamespace(uri: "http://s3.amazonaws.com/doc/2006-03-01/")
structure ListBucketsExtendedOutput {
    /// <p>Indicates whether more results are available.</p>
    IsTruncated: IsTruncated

    /// <p>Echo of the marker used to request this page (if any).</p>
    Marker: Marker

    /// <p>When the response is truncated, this element contains the marker that should be used for the next request.</p>
    NextMarker: NextMarker

    /// <p>Container of buckets.</p>
    Buckets: Buckets

    /// <p>Owner information for the buckets.</p>
    Owner: Owner
}

/// <p>Triggers a reattempt of replication for a bucket.</p>
@http(
    method: "PUT"
    uri: "/{Bucket}?ibm-replication-reattempt"
    code: 200
)
@httpChecksum(requestChecksumRequired: true)
operation PutBucketReplicationReattempt {
    input: PutBucketReplicationReattemptInput
    output: PutBucketReplicationReattemptOutput
}

structure PutBucketReplicationReattemptInput {
    /// <p>Bucket name</p>
    @required
    @httpLabel
    Bucket: BucketName
}

/// <p>No modeled body/headers returned.</p>
structure PutBucketReplicationReattemptOutput {}

/// <p>Lists replication failures for a bucket with pagination and filtering.</p>
@http(
    method: "GET"
    uri: "/{Bucket}?ibm-replication-failures"
    code: 200
)
@httpChecksum(requestChecksumRequired: true)
@paginated(
    inputToken: "ContinuationToken"
    outputToken: "NextContinuationToken"
    items: "Contents"
    pageSize: "MaxKeys"
)
operation ListBucketReplicationFailures {
    input: ListBucketReplicationFailuresInput
    output: ListBucketReplicationFailuresOutput
}

structure ListBucketReplicationFailuresInput {
    /// <p>Bucket name</p>
    @required
    @httpLabel
    Bucket: BucketName

    /// <p>Continuation token for pagination.</p>
    @httpQuery("continuation-token")
    ContinuationToken: Token

    /// <p>Maximum keys to return.</p>
    @httpQuery("max-keys")
    MaxKeys: MaxKeys

    /// <p>Filter: only entries whose first sync was attempted before this (string-formatted).</p>
    @httpQuery("first-sync-attempted-before")
    FirstSyncAttemptedBefore: String

    /// <p>Response encoding.</p>
    @httpQuery("encoding-type")
    EncodingType: EncodingType
}

@output
@xmlName("ListReplicationFailureResult")
@xmlNamespace(uri: "http://s3.amazonaws.com/doc/2006-03-01/")
structure ListBucketReplicationFailuresOutput {
    /// <p>Bucket name</p>
    @required
    Name: BucketName

    /// <p>Optional echo of filter used.</p>
    FirstSyncAttemptedBefore: String

    /// <p>Server-chosen page size (may be <= MaxKeys requested).</p>
    MaxKeys: MaxKeys

    /// <p>True if more results are available.</p>
    @required
    IsTruncated: IsTruncated

    /// <p>Response encoding.</p>
    EncodingType: EncodingType

    /// <p>Number of keys in this page.</p>
    @required
    KeyCount: KeyCount

    /// <p>Pagination: token provided to request this page.</p>
    ContinuationToken: Token

    /// <p>Pagination: token to request the next page.</p>
    NextContinuationToken: NextToken

    /// <p>Flattened list of failure entries. Each entry is emitted as a <Contents> element.</p>
    @required
    @xmlFlattened
    Contents: ReplicationFailureContentsList
}

list ReplicationFailureContentsList {
    @xmlName("Contents")
    member: ReplicationFailureEntry
}

structure ReplicationFailureEntry {
    @required
    Key: ObjectKey

    @required
    VersionId: ObjectVersionId

    @required
    SyncType: String

    /// <p>Timestamp of the first attempt to replicate this item.</p>
    @required
    FirstSyncAttempted: Timestamp

    /// <p>Timestamp of the last attempt to replicate this item.</p>
    @required
    LastSyncAttempted: Timestamp

    /// <p>Optional failure cause description or code.</p>
    SyncFailureCause: String
}

/// <p>Gets the protection configuration for a bucket.</p>
@http(
    method: "GET"
    uri: "/{Bucket}?protection"
    code: 200
)
operation GetBucketProtectionConfiguration {
    input: GetBucketProtectionConfigurationInput
    output: GetBucketProtectionConfigurationOutput
}

structure GetBucketProtectionConfigurationInput {
    /// <p>Bucket name</p>
    @required
    @httpLabel
    Bucket: BucketName
}

@output
@xmlName("ProtectionConfiguration")
structure GetBucketProtectionConfigurationOutput {
    /// <p>The status of the protection configuration.</p>
    Status: String

    /// <p>Minimum retention period.</p>
    MinimumRetention: MinimumRetentionPeriod

    /// <p>Default retention period.</p>
    DefaultRetention: DefaultRetentionPeriod

    /// <p>Maximum retention period.</p>
    MaximumRetention: MaximumRetentionPeriod

    /// <p>Indicates whether permanent retention is enabled.</p>
    EnablePermanentRetention: Boolean

    /// <p>IBM Protection Management State.</p>
    @httpHeader("x-ibm-protection-management-state")
    IbmProtectionManagementState: String
}

/// <p>Sets the protection configuration for a bucket.</p>
@http(
    method: "PUT"
    uri: "/{Bucket}?protection"
    code: 200
)
@httpChecksum(requestChecksumRequired: true)
operation PutBucketProtectionConfiguration {
    input: PutBucketProtectionConfigurationInput
}

structure PutBucketProtectionConfigurationInput {
    /// <p>Bucket name</p>
    @required
    @httpLabel
    Bucket: BucketName

    /// <p>Container for the protection configuration.</p>
    @required
    @httpPayload
    ProtectionConfiguration: ProtectionConfiguration
}

structure ProtectionConfiguration {
    /// <p>The status of the protection configuration.</p>
    Status: String

    /// <p>Minimum retention period.</p>
    MinimumRetention: MinimumRetentionPeriod

    /// <p>Default retention period.</p>
    DefaultRetention: DefaultRetentionPeriod

    /// <p>Maximum retention period.</p>
    MaximumRetention: MaximumRetentionPeriod

    /// <p>Indicates whether permanent retention is enabled.</p>
    EnablePermanentRetention: Boolean
}

structure MinimumRetentionPeriod {
    @required
    Days: Integer
}

structure DefaultRetentionPeriod {
    @required
    Days: Integer
}

structure MaximumRetentionPeriod {
    @required
    Days: Integer
}

/// <p>Adds a legal hold to an object.</p>
@http(
    method: "POST"
    uri: "/{Bucket}/{Key+}?legalHold"
    code: 200
)
operation AddLegalHold {
    input: AddLegalHoldInput
}

/// <p>Deletes a legal hold from an object.</p>
@http(
    method: "DELETE"
    uri: "/{Bucket}/{Key+}?legalHold"
    code: 200
)
operation DeleteLegalHold {
    input: DeleteLegalHoldInput
}

structure AddLegalHoldInput {
    @required
    @httpLabel
    Bucket: BucketName

    @required
    @httpLabel
    Key: ObjectKey

    @required
    @httpQuery("add")
    RetentionLegalHoldId: String
}

structure DeleteLegalHoldInput {
    @required
    @httpLabel
    Bucket: BucketName

    @required
    @httpLabel
    Key: ObjectKey

    @required
    @httpQuery("remove")
    RetentionLegalHoldId: String
}

/// <p>Lists legal holds for an object.</p>
@http(
    method: "GET"
    uri: "/{Bucket}/{Key+}?legalHold"
    code: 200
)
operation ListLegalHolds {
    input: ListLegalHoldsInput
    output: ListLegalHoldsOutput
}

structure ListLegalHoldsInput {
    @required
    @httpLabel
    Bucket: BucketName

    @required
    @httpLabel
    Key: ObjectKey

    @httpHeader("Mirror-Destination")
    MirrorDestination: String
}

@output
@xmlName("ListLegalHoldsResult")
structure ListLegalHoldsOutput {
    CreateTime: LegalHoldTimestamp
    LegalHolds: LegalHoldList
    RetentionPeriod: Integer
    RetentionPeriodExpirationDate: LegalHoldTimestamp
}

list LegalHoldList {
    @xmlName("LegalHold")
    member: LegalHoldEntry
}

structure LegalHoldEntry {
    Date: LegalHoldTimestamp
    ID: String
}

@timestampFormat("date-time")
timestamp LegalHoldTimestamp

@mixin
structure IBMFeatureGetObjectOutput {
    /// Storage class of the temporary restored copy (IBM COS).
    @httpHeader("x-ibm-restored-copy-storage-class")
    TemporaryCopyStorageClass: String

    /// Transition metadata (IBM COS).
    @httpHeader("x-ibm-transition")
    Transition: String

    /// <p>The number of legal holds applied to the object.</p>
    /// <p>This header is returned only when the object has an active legal hold.</p>
    @httpHeader("Retention-Legal-Hold-Count")
    RetentionLegalHoldCount: Integer
}

@mixin
structure IBMFeatureHeadObjectOutput {
    /// Storage class of the temporary restored copy (IBM COS).
    @httpHeader("x-ibm-restored-copy-storage-class")
    TemporaryCopyStorageClass: String

    /// Transition metadata (IBM COS).
    @httpHeader("x-ibm-transition")
    Transition: String

    /// <p>The number of legal holds applied to the object.</p>
    /// <p>This header is returned only when the object has an active legal hold.</p>
    @httpHeader("Retention-Legal-Hold-Count")
    RetentionLegalHoldCount: Integer
}

@mixin
structure IBMFeatureListObjectsOutput {
    /// Indicates whether IBM Server-Side Encryption with Key Protect (SSE-KP) is enabled for this bucket.
    @httpHeader("ibm-sse-kp-enabled")
    IBMSSEKPEnabled: Boolean

    /// The Cloud Resource Name (CRN) of the customer root key in IBM Key Protect used for SSE-KP.
    @httpHeader("ibm-sse-kp-customer-root-key-crn")
    IBMSSEKPCustomerRootKeyCrn: String
}

@mixin
structure IBMFeatureHeadBucketOutput {
    /// Indicates whether IBM Server-Side Encryption with Key Protect (SSE-KP) is enabled for this bucket.
    @httpHeader("ibm-sse-kp-enabled")
    IBMSSEKPEnabled: Boolean

    /// The Cloud Resource Name (CRN) of the customer root key in IBM Key Protect used for SSE-KP.
    @httpHeader("ibm-sse-kp-customer-root-key-crn")
    IBMSSEKPCustomerRootKeyCrn: String
}

@mixin
structure IBMFeatureCreateBucketInput {
    /// IBM Cloud Service Instance ID associated with the request.
    @httpHeader("ibm-service-instance-id")
    IBMServiceInstanceId: String

    /// SSE-KP encryption algorithm (e.g., AES256, AES-GCM variants if applicable).
    @httpHeader("ibm-sse-kp-encryption-algorithm")
    IBMSSEKPEncryptionAlgorithm: String

    /// The Cloud Resource Name (CRN) of the customer root key in IBM Key Protect used for SSE-KP.
    @httpHeader("ibm-sse-kp-customer-root-key-crn")
    IBMSSEKPCustomerRootKeyCrn: String
}

@mixin
structure IBMFeatureListBucketsInput {
    /// IBM Cloud Service Instance ID associated with the request.
    @httpHeader("ibm-service-instance-id")
    IBMServiceInstanceId: String
}

@mixin
structure IBMFeatureCopyObjectInput {
    @httpHeader("Retention-Legal-Hold-ID")
    RetentionLegalHoldId: String
}

@mixin
structure IBMFeatureCompleteMultipartUploadInput {
    @httpHeader("Retention-Legal-Hold-ID")
    RetentionLegalHoldId: String
}

@mixin
structure IBMFeaturePutObjectInput {
    @httpHeader("Retention-Legal-Hold-ID")
    RetentionLegalHoldId: String
}

@mixin
structure IBMFeaturePutObjectRetentionInput {
    @httpHeader("Retention-Legal-Hold-ID")
    RetentionLegalHoldId: String
}

@mixin
structure IBMFeaturePutObjectTaggingInput {
    @httpHeader("Retention-Legal-Hold-ID")
    RetentionLegalHoldId: String
}

@mixin
structure IBMFeatureGetObjectLockConfigurationOutput {
    /// IBM Protection Management State.
    @httpHeader("x-ibm-protection-management-state")
    IbmProtectionManagementState: String
}
