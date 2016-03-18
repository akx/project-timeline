/* eslint-env node, mocha */
import {parseAsRange, parseWeek} from '../src/dates';
import {expect} from 'chai';


describe("Date Parsing", () => {
    it("should parse single dates as 24 hour spans", () => {
        const [start, end] = parseAsRange("2016-03-17");
        expect(start.toISOString()).to.equal("2016-03-17T00:00:00.000Z");
        expect(end.toISOString()).to.equal("2016-03-18T00:00:00.000Z");
    });
    it("should parse date spans", () => {
        const [start, end] = parseAsRange("2016-01-01..2016-05-01");
        expect(start.toISOString()).to.equal("2016-01-01T00:00:00.000Z");
        expect(end.toISOString()).to.equal("2016-05-01T00:00:00.000Z");
    });
    it("should parse date spans with invalid ends as 24 hour spans", () => {
        const [start, end] = parseAsRange("2016-01-01..yieohdfh");
        expect(start.toISOString()).to.equal("2016-01-01T00:00:00.000Z");
        expect(end.toISOString()).to.equal("2016-01-02T00:00:00.000Z");
    });
    it("should ignore invalid dates", () => {
        expect(parseAsRange("jsfdikwrm")).to.equal(null);
    });
    it("should parse date span day shorthands", () => {
        const [start, end] = parseAsRange("2016-01-01..15");
        expect(start.toISOString()).to.equal("2016-01-01T00:00:00.000Z");
        expect(end.toISOString()).to.equal("2016-01-15T00:00:00.000Z");
    });
    it("should parse date span month-day shorthands", () => {
        const [start, end] = parseAsRange("2016-01-01..02-15");
        expect(start.toISOString()).to.equal("2016-01-01T00:00:00.000Z");
        expect(end.toISOString()).to.equal("2016-02-15T00:00:00.000Z");
    });
});

describe("Week Parsing", () => {
    it("should ignore invalid specs", () => {
        expect(parseWeek("2016w1814")).to.equal(null);
    });
    it("should implicitly use the current year", () => {
        const year = parseWeek("w5")[0].getYear();
        expect(year).to.equal(new Date().getYear());
    });
    it("should parse week specs", () => {
        const [start, end] = parseAsRange("2016w12");
        expect(start.toISOString()).to.equal("2016-03-14T00:00:00.000Z");
        expect(end.toISOString()).to.equal("2016-03-21T00:00:00.000Z");
    });
    it("should parse week spec spans", () => {
        const [start, end] = parseAsRange("2016w12..2016w15");
        expect(start.toISOString()).to.equal("2016-03-14T00:00:00.000Z");
        expect(end.toISOString()).to.equal("2016-04-11T00:00:00.000Z");
    });
    it("should parse week starts with date ends", () => {
        const [start, end] = parseAsRange("2016w12..2016-05-10");
        expect(start.toISOString()).to.equal("2016-03-14T00:00:00.000Z");
        expect(end.toISOString()).to.equal("2016-05-10T00:00:00.000Z");
    });
    it("should parse weeks with shorthand ends", () => {
        const [start, end] = parseAsRange("2016w12..15");
        expect(start.toISOString()).to.equal("2016-03-14T00:00:00.000Z");
        expect(end.toISOString()).to.equal("2016-04-11T00:00:00.000Z");
    });
});
