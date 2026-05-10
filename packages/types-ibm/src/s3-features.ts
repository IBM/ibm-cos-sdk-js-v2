/**
 * @public
 * Configuration for IBM Cloud Object Storage Retention features.
 * This allows setting default retention periods or permanent hold status on buckets.
 */
export interface IbmRetentionConfiguration {
    /**
     * Whether the retention policy is enabled for this bucket.
     */
    readonly enabled?: boolean;

    /**
     * The default retention period in days.
     */
    readonly defaultRetentionDays?: number;

    /**
     * Whether a permanent hold is applied to all objects in the bucket.
     */
    readonly permanentHold?: boolean;
}
