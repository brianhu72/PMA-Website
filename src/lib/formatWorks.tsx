import type { ReactNode } from "react";

const TITLES = [
  "Off-Campus/On-Screen, Cornell Life in the Time of COVID-19", "Escape from the Archive, Encountering History through Performance and Theater",
  "New Plays from Palestine, Theatre Between Home and Exile", "Tahrir Tales, Plays from the Egyptian Revolution",
  "An American Festival: A Celebration of Heritage, Community, and the Arts", "The Resistible Rise of Arturo Ui",
  "The Taming of the Shrew", "The Importance of Being Earnest", "The Good Person of Setzuan", "The Caucasian Chalk Circle",
  "The Merchant of Venice", "The House into Which We Are Born", "A Streetcar Named Desire", "The Marvelous Mrs. Maisel",
  "The Glass Menagerie", "The Night of the Iguana", "Death of a Salesman", "A View from the Bridge",
  "The House of Blue Leaves", "The Cherry Orchard", "The Three Sisters", "The Comedy of Errors",
  "The Winter's Tale", "The Bourgeois Gentleman", "The Negro in Drama and Theatre", "The President of Oolong",
  "The Drama Review", "Locally Grown Dance Festival", "The Strength of Our Convictions", "The Auburn Redemption",
  "The Memory Project", "The Jero Plays", "Waiting for Godot", "A History of Cornell", "She Stoops to Conquer",
  "The Misfit Man", "The Princess", "Alt Heidelberg", "Wilhelm Tell", "An Enemy of the People",
  "Like Falling Leaves", "Right You Are, If You Think So", "The Contrast", "Cornell Plays", "Men in White",
  "Dead End", "The Patriots", "Darkness at Noon", "Marat/Sade", "Streetcar", "My Children! My Africa!",
  "Brecht Project", "Mad Forest", "Angels in America, Part Two: Perestroika", "Fires in the Mirror",
  "Twilight: Los Angeles, 1992", "West Side Story", "Cabaret", "Company", "The Cocoanuts", "Baby", "Mass",
  "Miss Evers' Boys", "As You Like It", "Measure for Measure", "Richard III", "Romeo and Juliet", "Hamlet",
  "Twelfth Night", "Othello", "The Rover", "The Way of the World", "Tartuffe", "The Miser", "Speed the Plow",
  "Oleanna", "Dance Concert '09", "Dance '89", "Beehive", "Amadeus", "The Matchmaker", "Antigone", "Grapes of Wrath",
  "Betty's Summer Vacation", "Bee-Luther-Hatchee", "Comic Potential", "Inherit the Wind", "Vital Signs",
  "The Cornell Chronicle", "The Cornell Daily Sun", "Ithaca Times", "Our Town", "The Myopia", "Emergence", "Big Love",
  "Loan Sharking", "Precious Little", "Those Learned Ladies", "Spill", "Blood Wedding", "Inside/Out", "Maximum Will",
  "Human Again", "An Indeterminate Life", "This Incarcerated Life", "Mother of Exiles", "Desert of Light", "State of Siege",
  "Hamlet Wakes Up Late", "Casa Cushman", "Storm Country", "The Nether", "eTRASH", "Much Ado About Nothing", "The Mush Hole",
  "Persona", "Scapin", "Anno 1992", "Popocaterpillar", "BIPED", "Dance '99", "The Sun",
].sort((a, b) => b.length - a.length);

const TITLES_SET = new Set(TITLES);
const matcher = new RegExp(`(${TITLES.map((title) => title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");

export function formatWorks(value: ReactNode): ReactNode {
  if (typeof value !== "string") return value;
  return value.split(matcher).map((part, index) =>
    TITLES_SET.has(part) ? <em key={`${part}-${index}`}>{part}</em> : part
  );
}
