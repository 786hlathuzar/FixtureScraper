"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import the 'express' module
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
function getMonthNumber(month) {
    const monthNames = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12",
    };
    return monthNames[month] || "01"; // Default to "01" if month is not found
}
function scrapeFixtures() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = "https://www.crossinghoods.com";
        try {
            const response = yield axios_1.default.get(`${baseUrl}/software-engineer-test/`);
            const $ = cheerio.load(response.data);
            const results = [];
            // Get the date headers
            let currentDate;
            $(".fixres__header2").each((i, header) => {
                currentDate = $(header).text().trim(); // e.g., "Saturday 23rd November"
                // Loop through each fixture item under each date header
                $(header)
                    .nextUntil(".fixres__header2", ".fixres__item")
                    .each((j, element) => {
                    const teamA = $(element)
                        .find(".matches__participant--side1 .swap-text__target")
                        .text()
                        .trim();
                    const teamB = $(element)
                        .find(".matches__participant--side2 .swap-text__target")
                        .text()
                        .trim();
                    const time = $(element).find(".matches__date").text().trim();
                    // Convert date to ISO format
                    if (currentDate) {
                        const [dayOfWeek, dayWithSuffix, month] = currentDate.split(" ");
                        const day = dayWithSuffix.replace(/\D/g, ""); // Remove any suffixes like "rd", "th", etc.
                        const monthNumber = getMonthNumber(month);
                        // console.log(time);
                        const dateStr = `2024-${monthNumber}-${day}T${time}:00Z`; // Append 'Z' for UTC
                        console.log(dateStr); // Check the date string format
                        const date = new Date(dateStr);
                        console.log(date.toISOString());
                        if (!isNaN(date.getTime())) {
                            // Assign venue (replace with actual venue if available)
                            const venue = teamA === "Everton"
                                ? "Goodison Park"
                                : teamA === "Southampton"
                                    ? "St. Mary's Stadium"
                                    : `${teamA}'s Stadium`;
                            results.push({
                                tournament: "Premier League",
                                teamA,
                                teamB,
                                venue,
                                datetime: date.toISOString(),
                            });
                        }
                        else {
                            console.warn(`Invalid date: ${dateStr}`);
                        }
                    }
                });
            });
            console.log(results);
        }
        catch (error) {
            console.error("Error fetching fixtures:", error);
            return { results: [] };
        }
    });
}
// console.log(fixtureRows);
scrapeFixtures();
