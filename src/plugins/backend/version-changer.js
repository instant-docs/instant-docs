import { load } from "cheerio";

export default function versionChanger({ html, lang }) {
    const $ = load(html);
    function perpareVersionChanger() {
        document.addEventListener('DOMContentLoaded', () => {
            const options = document.getElementById('version-options');
            if (options) {
                options.addEventListener('change', (e) => {
                    window.location.assign(
                        window.getLinkFor('', lang, e.target.value)
                    );
                });
            }
        })
    }
    const scr = `<script>(${perpareVersionChanger.toString()})()</script>`;
    $('head').append(scr);
    return $.html();
}