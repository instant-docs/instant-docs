import { load } from "cheerio";

export default function addSignature({ html }) {
    const $ = load(html);
    const currentYear = new Date().getFullYear();

    // Find the footer element and append the year
    $('footer').append(`<center>${currentYear}</center>`);
    
    // Get the updated HTML
    return $.html();
}