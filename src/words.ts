/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Highly curated list of common, recognizable Dutch 5-letter words.
// Ideal for both daily puzzle selection (solution) and guess validation.
const RAW_WORDS = [
  "actie", "adres", "advies", "afval", "alarm", "album", "alles", "altijd", "amper", "angst", "anker", 
  "apart", "appel", "asiel", "avond", "baard", "basis", "bende", "beter", "beurs", "bevat", "biedt", 
  "bijna", "blaas", "blauw", "bleek", "blijf", "blind", "bloed", "bloem", "bloot", "bocht", "bodem", 
  "boete", "bogen", "bomen", "bonus", "boord", "boort", "borst", "bosje", "boter", "brand", "breed", 
  "breek", "brief", "bries", "broed", "broek", "brood", "bruid", "bruin", "bruis", "buren", "busje", 
  "buurt", "chaos", "check", "chips", "claim", "clown", "creme", "cross", "curve", "dadel", "dader", 
  "dagje", "daken", "dalen", "dames", "datum", "debat", "deken", "delen", "denkt", "derde", "desem", 
  "deugd", "dicht", "diepe", "dikte", "dille", "diner", "disco", "divan", "doelen", "doelt", "doffe", 
  "dokte", "dolen", "donor", "doods", "doorn", "dorst", "draad", "draag", "draai", "draak", "drank", 
  "dreun", "dring", "drink", "droef", "droog", "droom", "druip", "drugs", "duidt", "duim", "duren", 
  "durft", "dutje", "duwen", "dwaal", "dwaas", "dwerg", "dwars", "dweil", "eerst", "eikel", "einde", 
  "eisen", "eist", "emmer", "enige", "enkel", "enzym", "erger", "ernst", "etage", "ethos", "etter", 
  "exact", "extra", "fabel", "facet", "factor", "farao", "fases", "feest", "felle", "fiets", "fijne", 
  "filet", "films", "firma", "fitte", "flits", "flora", "fluit", "flyer", "fobie", "focus", "folie", 
  "forum", "foute", "foyer", "frans", "frase", "frats", "freak", "fruit", "fusie", "gaas", "galop", 
  "gaten", "gauw", "gaven", "gebak", "gebed", "gebit", "gebod", "gedoe", "geest", "geeuw", "gekte", 
  "gelid", "geluk", "genen", "genie", "genot", "genre", "gerei", "gerst", "gesel", "gesp", "geval", 
  "gevel", "geven", "gever", "gezin", "gilde", "gips", "glans", "glas", "gleuf", "globe", "gloed", 
  "gnoom", "goden", "goede", "gokje", "golf", "gooit", "gouds", "graad", "graaf", "graag", "graai", 
  "graan", "graas", "gram", "grapje", "gratis", "grauw", "grens", "griep", "grijp", "grijs", "grill", 
  "grime", "grind", "groei", "groen", "groep", "groet", "gromt", "grond", "groot", "grote", "grove", 
  "gruit", "gulle", "gunst", "haag", "haai", "haak", "haalt", "haard", "haas", "haat", "hagel", 
  "haken", "haler", "hallo", "halte", "hamer", "hangt", "hanen", "hapje", "haper", "harde", "harem", 
  "haring", "harkt", "harte", "haven", "haver", "havik", "hazen", "hecht", "heden", "heeft", "hefte", 
  "hegge", "heide", "heilig", "heisa", "heist", "hekel", "heks", "helder", "helft", "helpt", "hemel", 
  "heren", "herfst", "heter", "hetze", "heup", "hield", "hiken", "hinde", "hinkt", "hitte", "hoede", 
  "hoedt", "hoeft", "hoera", "hoest", "hoeve", "hofje", "hoger", "hoker", "hond", "hoofd", "hoop", 
  "hoopt", "hoorn", "hoort", "horde", "horen", "horst", "hotel", "house", "hout", "houten", "huid", 
  "huil", "huilt", "huis", "huist", "huizen", "hulp", "hulde", "huren", "hurkt", "hutje", "huur", 
  "huurt", "huwen", "hyena", "hype", "icoon", "idool", "ieder", "iepen", "ijzer", "imago", "imker", 
  "index", "input", "inrit", "intro", "inval", "inzet", "islam", "issue", "ivoor", "jacht", "jager", 
  "japon", "jaren", "jarig", "jasje", "jeans", "jeugd", "jeuk", "jeukt", "jicht", "jodel", "joker", 
  "jolly", "jonge", "joods", "joost", "joule", "jouw", "jubel", "juich", "juist", "juli", "juni", 
  "junta", "jurk", "jury", "kaal", "kaap", "kaars", "kaart", "kaas", "kabel", "kader", "kado", 
  "kaken", "kaki", "kalen", "kaler", "kalf", "kalm", "kalme", "kamel", "kamer", "kamp", "kampt", 
  "kano", "kanon", "kans", "kansen", "kant", "kanten", "kapel", "kaper", "kapje", "kapok", "kapot", 
  "karat", "karig", "kasje", "kassa", "kast", "kasten", "kater", "katoen", "katten", "koude", 
  "kous", "kozijn", "kraai", "kraak", "kraal", "kraam", "kraan", "krab", "krabt", "kramp", "krans", 
  "krant", "krast", "kreek", "kreet", "krent", "kreuk", "kreun", "krijg", "krijt", "krimp", "kring", 
  "kroeg", "kroes", "krom", "kromt", "kroon", "kroos", "krop", "kropt", "krul", "krult", "kruid", 
  "kruik", "kruim", "kruip", "kruis", "kruit", "kubus", "kudde", "kuier", "kuil", "kuilt", "kuip", 
  "kuis", "kuist", "kunst", "kuras", "kurk", "kust", "kusten", "kutje", "kwaad", "kwaak", "kwaal", 
  "kwak", "kwant", "kwart", "kwast", "kweek", "kwelt", "kwets", "kwiek", "kwijt", "kwijl", "laad", 
  "laadt", "laag", "label", "lader", "laden", "lade", "laffe", "laken", "lakens", "lakse", "lamp", 
  "lampen", "land", "landen", "lanen", "langs", "lange", "larve", "laser", "laste", "lastig", 
  "laten", "later", "latex", "latje", "latte", "lauwe", "laven", "lazer", "lease", "leder", "ledig", 
  "leef", "leeft", "leeg", "leem", "leen", "leent", "leer", "leert", "leers", "lees", "leest", 
  "leeuw", "leger", "lente", "lepel", "lezen", "lezer", "licht", "lieve", "linde", "linie", "links", 
  "liter", "loods", "lopen", "loper", "lucht", "lucas", "luier", "luis", "lunch", "maag", "maagd", 
  "maak", "maakt", "maan", "maand", "maans", "maar", "maat", "maats", "macht", "macho", "madam", 
  "mafia", "mager", "magie", "magma", "maken", "maker", "maler", "malie", "malle", "mamma", "manen", 
  "manga", "mango", "manke", "manco", "mans", "mapje", "marge", "maria", "markt", "massa", "mast", 
  "masten", "match", "mate", "maten", "mater", "matig", "matrix", "motto", "muren", "muur", "naakt", 
  "naald", "naast", "nacht", "nadat", "nader", "nagel", "namen", "natie", "natte", "navel", "nevel", 
  "nicht", "nieuw", "nodig", "nogal", "nooit", "noord", "noten", "oasis", "ocean", "oever", "ofwel", 
  "olijf", "omdat", "omweg", "onder", "onheil", "onkel", "onrust", "onzin", "oogje", "oogst", "ooit", 
  "oorlog", "opdat", "opeen", "open", "opent", "opera", "opzet", "orde", "order", "orgel", "orgie", 
  "otter", "ouder", "oudste", "ounce", "ovaal", "ovens", "over", "overal", "paard", "paars", "pacht", 
  "paddo", "paden", "padje", "pager", "pages", "pakje", "paling", "pallet", "palm", "palms", "pampa", 
  "panda", "panel", "paniek", "panty", "pardo", "parel", "park", "parken", "part", "partij", "parts", 
  "party", "pasar", "pasje", "pasta", "paste", "pater", "pauze", "pauw", "pedal", "pegel", "peild", 
  "peilt", "peinz", "pekel", "pelle", "pelt", "penis", "peper", "pinda", "plaat", "plak", "plan", 
  "plank", "plant", "plas", "platte", "plein", "plooi", "plots", "pluim", "pluis", "pluk", "poeder", 
  "poema", "poep", "poet", "poets", "pogen", "poker", "polen", "polio", "polis", "polka", "pols", 
  "polst", "pomp", "pompen", "pompt", "poot", "pootje", "popje", "poort", "porie", "porst", "port", 
  "porta", "porte", "porto", "poses", "posje", "post", "posten", "poten", "poter", "potig", "potje", 
  "potte", "poule", "power", "praat", "preek", "prent", "priem", "prijs", "prik", "prima", "prins", 
  "print", "prior", "privé", "proef", "prooi", "praal", "provo", "pruik", "pruim", "prul", "psalm", 
  "puber", "puien", "puilt", "puin", "puist", "pulle", "punch", "pupil", "puppy", "pure", "puren", 
  "putje", "putte", "pylon", "pyama", "radar", "raden", "rader", "radio", "rafer", "rage", "ragen", 
  "rails", "rally", "ramen", "ramer", "ramp", "rampen", "ranch", "rand", "randen", "ranke", "rasje", 
  "rasp", "raspt", "raster", "ratel", "ratte", "rauwe", "ravijn", "rayon", "rebel", "recept", "reeds", 
  "reeks", "reep", "regen", "regie", "regio", "reide", "reine", "reis", "reist", "reken", "rente", 
  "reus", "rezen", "richt", "riem", "riemen", "rijde", "rijden", "rijder", "rijdt", "rijgen", "rijke", 
  "rijm", "rijmt", "rijn", "rijp", "rijpe", "rijs", "rijst", "rille", "ring", "ringen", "riool", 
  "ripje", "risico", "ritme", "rits", "ritst", "rival", "robot", "robuust", "rockt", "rodel", "roden", 
  "roder", "roem", "roemt", "roep", "roept", "roer", "roert", "roest", "rogge", "roken", "roker", 
  "rokje", "rolde", "rolt", "roman", "romer", "romig", "romp", "rommel", "ronde", "rondom", "roof", 
  "rooft", "rookt", "room", "rooms", "roomt", "roos", "roost", "root", "rosé", "rosse", "rossen", 
  "roste", "rotor", "rots", "rotsen", "rotte", "route", "rover", "royal", "rugby", "ruige", "ruigt", 
  "ruil", "ruilt", "ruim", "ruime", "ruimt", "ruis", "ruist", "ruit", "ruite", "rukte", "rund", 
  "ruzie", "saai", "saaie", "sabel", "sacre", "safari", "sagen", "saker", "saldo", "salie", "salon", 
  "salsa", "salto", "salut", "samba", "samen", "sauna", "saver", "scala", "scart", "scene", "schat", 
  "schep", "scherp", "schijt", "schil", "schim", "schip", "schom", "schop", "schor", "schot", 
  "schou", "schra", "schre", "schuif", "schuin", "schuim", "schuit", "schulp", "schur", "schut", 
  "scoop", "score", "scout", "scuba", "sedan", "seine", "sekte", "selen", "semen", "sepia", "serge", 
  "serie", "serum", "seven", "sfeer", "shake", "shape", "shawl", "sherpa", "shift", "shits", 
  "shock", "short", "shots", "shows", "shunt", "sibbe", "siera", "sier", "sigaar", "silo", "sinus", 
  "sipje", "sippe", "sirop", "sisal", "sjaal", "sjef", "sjeik", "sjerp", "sjeu", "sjirp", "sjoel", 
  "sjouw", "ska", "skate", "skiff", "skils", "skinn", "skin", "skirt", "slaag", "slaagt", "slaap", 
  "slaan", "slag", "slak", "slang", "slank", "slap", "slide", "slijk", "slijm", "slijp", "slijt", 
  "slik", "slikt", "slim", "slime", "slip", "slips", "slipt", "slof", "sloft", "slome", "slons", 
  "slont", "sloop", "sloopt", "sloor", "sloot", "slor", "slorp", "slot", "sluis", "sluit", "slurf", 
  "slurp", "smaak", "smack", "smal", "smale", "smart", "smash", "smeden", "smeder", "smeek", "smeer", 
  "smeert", "smelt", "smet", "smeten", "smeul", "smijt", "smink", "smits", "smoor", "smoort", "smout", 
  "smul", "smult", "snaar", "snack", "snak", "snakt", "snap", "snapt", "snede", "sneeuw", "snel", 
  "snelle", "snelt", "snerp", "snert", "sneu", "snik", "snikt", "snip", "snit", "snoei", "snoep", 
  "snoer", "snoes", "snoet", "snof", "snook", "snoor", "snoot", "snort", "snuif", "snuit", "snurk", 
  "sober", "sobere", "soda", "soesa", "soes", "soest", "sofa", "softe", "soja", "sokje", "solar", 
  "solis", "sonar", "sonde", "sonny", "soort", "soos", "sopje", "sopjes", "sorry", "sound", "spaan", 
  "spaar", "spat", "speed", "speel", "speelt", "speen", "speer", "speet", "spek", "spekt", "spel", 
  "speld", "spelt", "spied", "spier", "spies", "spiet", "spijk", "spijs", "spijt", "spik", "spin", 
  "spinn", "spint", "spion", "spit", "spits", "split", "spons", "spook", "spoor", "sport", "spot", 
  "spray", "sprei", "spriet", "spring", "sprits", "spruit", "spuug", "spuwt", "staag", "staal", 
  "staan", "staar", "staat", "stads", "staf", "stage", "stak", "stalen", "staler", "stam", "stamp", 
  "stamt", "stand", "stang", "stank", "stans", "stap", "stapel", "stapper", "start", "staten", 
  "stave", "stede", "steun", "steur", "steve", "stift", "stijg", "stijl", "stijve", "strik", 
  "strob", "strop", "stuif", "sturen", "stuur", "stijf", "stoot", "tabak", "tabel", "tacht", "tafel", 
  "taken", "takje", "talen", "talig", "talon", "talud", "tamme", "tango", "tante", "tarra", "tarwe", 
  "tasje", "taxis", "tegel", "tegen", "teken", "telen", "teler", "telex", "tempo", "tenen", "tenis", 
  "tenor", "tenue", "terg", "tergt", "terra", "tert", "terug", "teste", "tests", "theta", "thuis", 
  "tiara", "ticket", "tiend", "tiener", "tient", "tijde", "tijd", "tijden", "tijdig", "tijger", 
  "tikje", "tille", "timen", "timer", "times", "titel", "titis", "tjilp", "tocht", "toer", "toert", 
  "toets", "toffe", "toga", "token", "tolk", "tolle", "tolt", "tomaat", "tombe", "tonen", "toner", 
  "tonic", "tonne", "toois", "toom", "toon", "toont", "toor", "toorn", "toort", "toost", "topic", 
  "topje", "toppe", "topper", "torre", "torst", "tosti", "totem", "touch", "tours", "touw", "touwe", 
  "touwt", "traag", "traan", "traas", "tract", "trage", "train", "traje", "trakt", "tram", "trams", 
  "trance", "trane", "trant", "trap", "traps", "trapt", "trast", "tree", "treed", "treen", "treft", 
  "trein", "trek", "trekt", "trend", "treur", "trias", "tribe", "trico", "trijp", "trill", "trilt", 
  "triple", "trio", "trip", "trips", "tript", "troef", "troep", "trog", "trols", "trom", "tromp", 
  "troon", "troop", "troost", "trots", "trouw", "trouwt", "truck", "truc", "trucs", "trui", "truis", 
  "tucht", "tudor", "tuig", "tuigt", "tuin", "tuinen", "tuint", "tulp", "tulpen", "tunen", "tuner", 
  "tunes", "turbo", "turf", "turft", "turk", "turke", "turn", "turnt", "tweed", "twijg", "twijn", 
  "twint", "twist", "typen", "typer", "types", "uilen", "uniek", "units", "urine", "vacht", "vadem", 
  "vader", "vage", "vager", "vaker", "valer", "vallei", "valse", "vanaf", "vangt", "varen", "varia", 
  "varken", "vaste", "vaten", "vecht", "veder", "veeg", "veegt", "veel", "veelt", "veen", "veer", 
  "veert", "veger", "veile", "veilig", "veins", "velen", "veler", "velie", "venus", "veraf", "veras", 
  "verde", "verf", "verft", "verre", "vers", "verse", "versje", "verve", "vest", "veste", "veter", 
  "vetje", "vette", "veule", "vezel", "video", "vides", "vief", "vieze", "vijand", "vijf", "vijfe", 
  "vijft", "vijg", "vijgen", "vijl", "vijlt", "vijver", "vilt", "vink", "vinkt", "vinyl", "viola", 
  "viool", "viper", "virus", "visje", "visser", "vlaag", "vlaai", "vlage", "vlam", "vlamt", "vlas", 
  "vlees", "vleet", "vlek", "vlekt", "vlerk", "vleug", "vlieg", "vlier", "vlies", "vliet", "vlijt", 
  "vloei", "vloer", "vloot", "vlot", "vlots", "vlucht", "vogel", "voeg", "voegt", "voel", "voelt", 
  "voet", "voete", "vogels", "volgd", "volgt", "volks", "volk", "volle", "volop", "volt", "volte", 
  "vonk", "vonkt", "voogd", "voord", "voor", "voors", "voort", "voos", "vork", "vorm", "vorms", 
  "vormt", "vorst", "vosje", "voste", "vouwt", "voze", "vozer", "vracht", "vraag", "vrager", "vrede", 
  "vrees", "vreest", "vreet", "vriend", "vries", "vrije", "vrind", "vroed", "vroeg", "vrome", 
  "vroom", "vrouw", "vrucht", "vuil", "vuile", "vuils", "vuist", "vulle", "vuren", "vurig", "vuur", 
  "vuurt", "waad", "waadt", "waag", "waagt", "waai", "waait", "waal", "waan", "waand", "waant", 
  "waar", "waard", "waars", "waart", "wacht", "waden", "wader", "wafel", "wagen", "wager", "wagon", 
  "walen", "walm", "walmt", "wals", "walst", "wandel", "wanen", "wang", "wange", "wank", "wankt", 
  "wanst", "want", "wants", "wapen", "waren", "warm", "warme", "warmt", "wasco", "wasem", "waser", 
  "wasje", "wasse", "wasser", "waste", "water", "watje", "wauw", "waven", "waver", "waves", "waxen", 
  "wazin", "weder", "weegt", "week", "weeks", "weekt", "ween", "weent", "weer", "weerd", "weers", 
  "weert", "wees", "wege", "wegen", "weger", "wegje", "wegwe", "weide", "weids", "welig", "welke", 
  "welp", "wemel", "wende", "wendt", "wenk", "wenkt", "wennen", "went", "wentel", "werf", "werkt", 
  "werpe", "werps", "werp", "werpt", "wervel", "werven", "wesp", "wespe", "west", "westen", "weten", 
  "weter", "wetje", "wetten", "wever", "wezen", "wezer", "wezel", "wied", "wiedt", "wieg", "wiegt", 
  "wiel", "wielen", "wieler", "wiens", "wier", "wies", "wigje", "wijd", "wijde", "wijk", "wijkt", 
  "wijl", "wijn", "wijnen", "wijs", "wijst", "wijte", "wijt", "wijve", "wijzen", "wijzer", "wild", 
  "wilde", "wilds", "wilg", "wille", "willen", "wilt", "wimpel", "wimp", "wind", "winden", "winds", 
  "windt", "wing", "wink", "winkel", "winnen", "winst", "winter", "wipje", "wippe", "wipst", "wisje", 
  "wiske", "wissel", "wisse", "wisser", "wist", "wiste", "woud", "woude", "wulf", "wulps", "wurg", 
  "wurgt", "wurmt"
];

// Deduplicate, filter exactly 5 letter words with lowercase-only letters, and sort
export const WORDS: string[] = Array.from(
  new Set(
    RAW_WORDS
      .map(w => w.trim().toLowerCase())
      .filter(w => /^[a-z]{5}$/.test(w))
  )
).sort();

/**
 * Gets the daily 5-letter word deterministically based on date string (YYYY-MM-DD)
 */
export function getDailyWord(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`; // representing the local date e.g., "2026-06-03"
  
  // Use a string hashing technique to get a deterministic index
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % WORDS.length;
  
  return {
    word: WORDS[index].toUpperCase(),
    dateStr
  };
}

/**
 * Validates if a given word exists in our expanded list of Dutch words.
 */
export function isValidWord(word: string): boolean {
  return WORDS.includes(word.trim().toLowerCase());
}
