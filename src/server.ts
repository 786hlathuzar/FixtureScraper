import axios from "axios";
import * as cheerio from "cheerio";

function getMonthNumber(month: string): string {
  const monthNames: { [key: string]: string } = {
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
  return monthNames[month] || "01";
}
async function scrapeFixtures() {
  const baseUrl = "https://www.crossinghoods.com";

  try {
    const response = await axios.get(`${baseUrl}/software-engineer-test/`);
    const $ = cheerio.load(response.data);

    const results: any[] = [];

    // Get the date headers
    let currentDate: string | undefined;
    $(".fixres__header2").each((i, header) => {
      currentDate = $(header).text().trim();
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

          if (currentDate) {
            const [dayWithSuffix, month] = currentDate.split(" ");
            const day = dayWithSuffix.replace(/\D/g, "");
            const monthNumber = getMonthNumber(month);

            const dateStr = `2024-${monthNumber}-${day}T${time}:00Z`;
            console.log(dateStr);
            const date = new Date(dateStr);
            console.log(date.toISOString());

            if (!isNaN(date.getTime())) {
              const venue =
                teamA === "Everton"
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
            } else {
              console.warn(`Invalid date: ${dateStr}`);
            }
          }
        });
    });

    console.log(results);
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    return { results: [] };
  }
}

scrapeFixtures();
