/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All Rights Reserved.
 * See 'LICENSE' in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

export class PackageVersion {
    major: number;
    minor: number;
    patch: number;
    suffix?: string;
    suffixVersion: number;

    constructor(version: string) {
        const tokens: string[] = version.split(new RegExp('[-\\.]', 'g')); // Match against dots and dashes
        if (tokens.length < 3) {
            throw new Error(`Failed to parse version string: ${version}`);
        }

        this.major = parseInt(tokens[0]);
        this.minor = parseInt(tokens[1]);
        this.patch = parseInt(tokens[2]);

        if (tokens.length > 3) {
            const firstDigitOffset: number = tokens[3].search(new RegExp(/(\d)/)); // Find first occurrence of 0-9
            if (firstDigitOffset !== -1) {
                this.suffix = tokens[3].substring(0, firstDigitOffset);
                this.suffixVersion = parseInt(tokens[3].substring(firstDigitOffset));
            } else {
                this.suffix = tokens[3];
                this.suffixVersion = 1;
            }
        } else {
            this.suffix = undefined;
            this.suffixVersion = 0;
        }

        if (this.major === undefined
            || this.major === null
            || this.minor === undefined
            || this.minor === null
            || this.patch === undefined
            || this.patch === null) {
            throw new Error(`Failed to parse version string: ${version}`);
        }
    }

    public isEqual(other: PackageVersion): boolean {
        return this.major === other.major && this.minor === other.minor && this.patch === other.patch &&
            this.suffix === other.suffix && this.suffixVersion === other.suffixVersion;
    }

    public isGreaterThan(other: PackageVersion, suffixStr: string | undefined): boolean {
        if (suffixStr && ((this.suffix && !this.suffix.startsWith(suffixStr)) || (other.suffix && !other.suffix.startsWith(suffixStr)))) {
            return false;
        }

        let diff: number = this.major - other.major;
        if (diff) {
            return diff > 0;
        } else {
            diff = this.minor - other.minor;
            if (diff) {
                return diff > 0;
            } else {
                diff = this.patch - other.patch;
                if (diff) {
                    return diff > 0;
                } else {
                    if (!suffixStr) {
                        return false; // isEqual = true
                    }
                    if (this.suffix) {
                        if (!other.suffix) {
                            return false;
                        }
                        return (this.suffixVersion > other.suffixVersion);
                    } else {
                        return other.suffix ? true : false;
                    }
                }
            }
        }
    }
}
