import {dataCache} from "./utils";

/**
 * This file contains the ORCIDInfo class, which is used to store information about an ORCiD.
 */
export class ORCIDInfo {

    /**
     * The ORCiD of the person.
     * @private
     */
    private readonly _orcid: string;

    /**
     * The family name of the person.
     * @private
     */
    private readonly _familyName: string;

    /**
     * The given names of the person.
     * @private
     */
    private readonly _givenNames: string[];

    /**
     * A list of employments of the person.
     * It is a list of objects, each containing the start date, end date, organization and department of the employment.
     * (optional)
     * @private
     */
    private readonly _employments?: {

        /**
         * The start date of the employment.
         */
        startDate: Date,

        /**
         * The end date of the employment.
         * If the employment is still ongoing, this is null.
         */
        endDate: Date | null,

        /**
         * The organization of the employment.
         */
        organization: string,

        /**
         * The department of the employment.
         */
        department: string,
    }[];

    /**
     * The preferred locale of the person.
     * (optional)
     * @private
     */
    private readonly _preferredLocale?: string;

    /**
     * The biography of the person.
     * (optional)
     * @private
     */
    private readonly _biography?: string;

    /**
     * The list of email addresses of the person.
     * (optional)
     * @private
     */
    private readonly _emails?: {
        /**
         * The email address itself.
         */
        email: string,
        /**
         * Whether the email address is the primary email address of the person.
         */
        primary: boolean,
        /**
         * Whether the email address is verified.
         */
        verified: boolean,
    }[];

    /**
     * The list of keywords of the person.
     * (optional)
     * @private
     */
    private readonly _keywords?: {
        /**
         * The keyword itself.
         */
        content: string,
        /**
         * The index of the keyword.
         */
        index: number,
    }[];

    /**
     * A list of customized URLs provided by the person.
     * (optional)
     * @private
     */
    private readonly _researcherUrls?: {
        /**
         * The URL itself.
         */
        url: string,
        /**
         * The name of the URL.
         */
        name: string,
        /**
         * The index of the URL.
         */
        index: number,
    }[]

    /**
     * The country where the person is located.
     * (optional)
     * @private
     */
    private readonly _country?: string;

    /**
     * The raw JSON data received from the ORCiD API.
     * @private
     */
    private readonly _ORCiDJSON: object;

    constructor(orcid: string, ORCiDJSON: object, familyName: string, givenNames: string[], employments?: {
        startDate: Date;
        endDate: Date | null;
        organization: string;
        department: string
    }[], preferredLocale?: string, biography?: string, emails?: {
        email: string;
        primary: boolean;
        verified: boolean
    }[], keywords?: { content: string; index: number }[], researcherUrls?: {
        url: string;
        name: string;
        index: number
    }[], country?: string) {
        this._orcid = orcid;
        this._familyName = familyName;
        this._givenNames = givenNames;
        this._employments = employments;
        this._preferredLocale = preferredLocale;
        this._biography = biography;
        this._emails = emails;
        this._keywords = keywords;
        this._researcherUrls = researcherUrls;
        this._country = country;
        this._ORCiDJSON = ORCiDJSON;
    }

    /**
     * Outputs the ORCiD of the person.
     */
    get orcid(): string {
        return this._orcid;
    }

    /**
     * Outputs the family name of the person.
     */
    get familyName(): string {
        return this._familyName;
    }

    /**
     * Outputs the given names of the person.
     */
    get givenNames(): string[] {
        return this._givenNames;
    }

    /**
     * Outputs the raw JSON data received from the ORCiD API.
     */
    get ORCiDJSON(): object {
        return this._ORCiDJSON;
    }

    /**
     * Outputs the list of employments of the person.
     */
    get employments(): {
        startDate: Date,
        endDate: Date | null,
        organization: string,
        department: string
    }[] {
        return this._employments;
    }

    /**
     * Outputs the preferred locale of the person.
     */
    get preferredLocale(): string {
        return this._preferredLocale;
    }

    /**
     * Outputs the biography of the person.
     */
    get biography(): string {
        return this._biography;
    }

    /**
     * Outputs the list of email addresses of the person.
     */
    get emails(): { email: string; primary: boolean; verified: boolean }[] {
        return this._emails;
    }

    /**
     * Outputs the list of keywords of the person.
     */
    get keywords(): { content: string; index: number }[] {
        return this._keywords;
    }

    /**
     * Outputs the list of customized URLs provided by the person.
     */
    get researcherUrls(): { url: string; name: string; index: number }[] {
        return this._researcherUrls;
    }

    /**
     * Outputs the country where the person is located.
     */
    get country(): string {
        return this._country;
    }

    /**
     * Outputs the employment object of the person at a given date.
     * @param date The date to check.
     */
    getAffiliationsAt(date: Date): {
        startDate: Date,
        endDate: Date | null,
        organization: string,
        department: string,
    }[] {
        let affiliations: {
            startDate: Date,
            endDate: Date | null,
            organization: string,
            department: string,
        }[] = [];
        for (const employment of this._employments) {
            if (employment.startDate <= date && employment.endDate === null) affiliations.push(employment);
            if (employment.startDate <= date && employment.endDate !== null && employment.endDate >= date) affiliations.push(employment);
        }
        return affiliations;
    }

    getAffiliationAsString(affiliation: {
        startDate: Date,
        endDate: Date | null,
        organization: string,
        department: string,
    }, showDepartment: boolean = true): string | undefined {
        if (affiliation === undefined || affiliation.organization === null) return undefined;
        else {
            if (showDepartment && affiliation.department !== null) return `${affiliation.organization} [${affiliation.department}]`;
            else return affiliation.organization;
        }
    }

    /**
     * Checks if a string has the format of an ORCiD.
     * @param text The string to check.
     */
    static isORCiD(text: string): boolean {
        return text.match("^(https:\/\/orcid.org\/)?[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$") !== null;
    }

    /**
     * Fetches the ORCiD data for a given ORCiD and returns it as an ORCIDInfo object.
     * @param orcid The ORCiD to fetch the data for.
     */
    static async getORCiDInfo(orcid: string): Promise<ORCIDInfo> {
        if (!ORCIDInfo.isORCiD(orcid)) throw new Error("Invalid input");

        if (orcid.match("^(https:\/\/orcid.org\/)?[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$") !== null) orcid = orcid.replace("https://orcid.org/", "");

        const response = await dataCache.fetch(`https://pub.orcid.org/v3.0/${orcid}`, {
            headers: {
                "Accept": "application/json"
            }
        })

        const rawOrcidJSON = await response.json();

        // Parse family name and given names
        const familyName = rawOrcidJSON["person"]["name"]["family-name"]["value"];
        const givenNames = rawOrcidJSON["person"]["name"]["given-names"]["value"];

        // Parse employments, if available
        const affiliations = rawOrcidJSON["activities-summary"]["employments"]["affiliation-group"];
        let employments: {
            startDate: Date,
            endDate: Date | null,
            organization: string,
            department: string,
        }[] = [];
        try {
            for (let i = 0; i < affiliations.length; i++) {
                const employmentSummary = affiliations[i]["summaries"][0]["employment-summary"];
                let employment = {
                    startDate: new Date(),
                    endDate: null,
                    organization: null,
                    department: null
                }
                if (employmentSummary["start-date"] !== null) employment.startDate = new Date(employmentSummary["start-date"]["year"]["value"], employmentSummary["start-date"]["month"]["value"], employmentSummary["start-date"]["day"]["value"]);
                if (employmentSummary["end-date"] !== null) employment.endDate = new Date(employmentSummary["end-date"]["year"]["value"], employmentSummary["end-date"]["month"]["value"], employmentSummary["end-date"]["day"]["value"]);
                employment.organization = employmentSummary["organization"]["name"];
                employment.department = employmentSummary["department-name"];

                employments.push(employment);
            }
        } catch (e) {
        }

        // Parse preferred locale, if available
        let preferredLocale: string | undefined = rawOrcidJSON["preferences"]["locale"] !== null ? rawOrcidJSON["preferences"]["locale"] : undefined;

        // Parse biography, if available
        let biography: string | undefined = rawOrcidJSON["person"]["biography"] !== null ? rawOrcidJSON["person"]["biography"]["content"] : undefined;

        // Parse e-mail addresses, if available
        let emails: { email: string; primary: boolean; verified: boolean }[] | undefined = [];
        if (rawOrcidJSON["person"]["emails"]["email"] !== null) {
            for (const email of rawOrcidJSON["person"]["emails"]["email"]) {
                emails.push({
                    email: email["email"],
                    primary: email["primary"],
                    verified: email["verified"]
                });
            }
        }

        // Parse keywords, if available, and sort them by index
        let keywords: { content: string; index: number }[] | undefined = [];
        if (rawOrcidJSON["person"]["keywords"]["keyword"] !== null) {
            for (const keyword of rawOrcidJSON["person"]["keywords"]["keyword"]) {
                keywords.push({
                    content: keyword["content"],
                    index: keyword["display-index"]
                });
            }
            keywords.sort((a, b) => a.index - b.index);
        }

        // Parse researcher URLs, if available, and sort them by index
        let researcherUrls: { url: string; name: string; index: number }[] | undefined = [];
        if (rawOrcidJSON["person"]["researcher-urls"]["researcher-url"] !== null) {
            for (const researcherUrl of rawOrcidJSON["person"]["researcher-urls"]["researcher-url"]) {
                researcherUrls.push({
                    url: researcherUrl["url"]["value"],
                    name: researcherUrl["url-name"],
                    index: researcherUrl["display-index"]
                });
            }
            researcherUrls.sort((a, b) => a.index - b.index);
        }

        // Parse country, if available
        let country: string | undefined = (rawOrcidJSON["person"]["addresses"]["address"].length > 0) ? rawOrcidJSON["person"]["addresses"]["address"][0]["country"]["value"] : undefined;

        // Return the ORCIDInfo object
        return new ORCIDInfo(orcid, rawOrcidJSON, familyName, givenNames, employments, preferredLocale, biography, emails, keywords, researcherUrls, country);
    }
}
