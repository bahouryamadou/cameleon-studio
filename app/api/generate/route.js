import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-6";

const SYSTEM_PROMPT = `Tu es a la fois directeur artistique senior et developpeur front-end senior. Tu produis des sites vitrine ONE-PAGE complets, operationnels et distinctifs (jamais "templated").
Tu reponds UNIQUEMENT avec un document HTML complet et autonome, de <!DOCTYPE html> a </html>. Aucun texte avant ou apres, aucun backtick markdown.
REGLES:
- HTML5 semantique, responsive mobile-first, accessible (focus visibles, contrastes, alt, aria sur le menu burger).
- Tout le CSS dans une balise <style> dans le <head>. CSS moderne: variables, clamp(), grid/flex. Aucun framework externe.
- 1 a 2 Google Fonts via <link>, paire display+texte intentionnelle.
- Structure riche: header sticky + nav burger mobile, hero fort, services/offres, a propos, preuve (stats/temoignages), contact (liens mailto:/tel:), footer.
- Micro-interactions sobres (reveal au scroll via IntersectionObserver). Respecte prefers-reduced-motion.
- Copy 100% en francais, specifique au metier, credible. Jamais de lorem ipsum.
- Identite visuelle assumee, palette coherente, element signature. Evite les defauts generiques.
- HERO 3D si demande: scene Three.js via https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js, en fond du hero, pointer-events:none, legere, coupee si prefers-reduced-motion, avec gestion du resize.
- MODIFICATION: si on te donne un HTML existant + une demande, renvoie le document HTML COMPLET mis a jour (jamais un diff).`;

function buildCreate(b) {
  b = b || {};
  const l = ["Cree un site vitrine one-page complet pour cette activite :"];
  l.push("- Nom : " + (b.name || "(a inventer a partir du secteur)"));
  l.push("- Secteur : " + (b.sector || "non precise"));
  if (b.goal) l.push("- Objectif du site : " + b.goal);
  if (b.services) l.push("- Offres / services : " + b.services);
  if (b.city) l.push("- Ville : " + b.city);
  if (b.email) l.push("- Email : " + b.email);
  if (b.phone) l.push("- Telephone : " + b.phone);
  if (b.style && b.style !== "Auto") l.push("- Ambiance : " + b.style);
  if (b.sections) l.push("- Sections en plus : " + b.sections);
  l.push("- Hero 3D anime (Three.js) : " + (b.threed ? "OUI" : "non"));
  l.push("\nDonne-lui une vraie identite, une copy credible, une construction solide. Renvoie uniquement le HTML complet.");
  return l.join("\n");
}

function buildEdit(html, instruction) {
  return "HTML actuel :\n\n----- DEBUT -----\n" + (html || "") + "\n----- FIN -----\n\nModification demandee : " + (instruction || "") + "\n\nRenvoie le document HTML complet mis a jour, sans texte autour.";
}

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("ERREUR: ANTHROPIC_API_KEY manquante.", { status: 500 });
  }
  let body;
  try { body = await req.json(); } catch (e) { return new Response("ERREUR: requete invalide.", { status: 400 }); }
  const { mode, brief, html, instruction } = body || {};
  const content = mode === "edit" ? buildEdit(html, instruction) : buildCreate(brief);

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const ms = await client.messages.stream({
          model: MODEL,
          max_tokens: 16000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content }],
        });
        for await (const ev of ms) {
          if (ev.type === "content_block_delta" && ev.delta && ev.delta.type === "text_delta") {
            controller.enqueue(enc.encode(ev.delta.text));
          }
        }
      } catch (err) {
        controller.enqueue(enc.encode("\n<!-- ERREUR_API: " + ((err && err.message) || String(err)) + " -->"));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
