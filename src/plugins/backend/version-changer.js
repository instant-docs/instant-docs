import { load } from "cheerio";

export default function versionChanger({ html, lang }) {
    const $ = load(html);
    function perpareVersionChanger() {
        document.addEventListener('DOMContentLoaded', () => {
            const options = document.getElementById('version-options');
            if (options) {
                options.addEventListener('change', (e) => {
                    window.location.assign(
                        window.getLink({ slug: '/', version: e.target.value, lang }),
                    );
                });
            }
        })
    }
    const scr = `<script>(${perpareVersionChanger.toString()})()</script>`;
    $('head').append(scr);
    return $.html();
}