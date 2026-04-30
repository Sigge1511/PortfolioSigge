import { type CSSProperties } from 'react';
import '../styles/pages/recommendations.css';

interface Recommendation {
  id: number;
  name: string;
  title: string;
  company: string;
  relationship: string;
  date: string;
  quote: string;
  initials: string;
}

const recommendations: Recommendation[] = [
    {
        id: 1,
        name: 'Hamed Adeli Meadeli',
        title: 'Software Engineer, mentor via #AddHer',
        company: 'Sogeti',
        relationship: 'Mentor',
        date: 'April 2026',
        quote:
            'Det som sticker ut är inte bara koden, utan också hur hon strukturerar och tänker kring lösningen — något som inte alltid är lätt i början av karriären. Jag tycker att hon är en stark kandidat för en .NET - utvecklarroll och har stor potential att växa snabbt i en professionell miljö. Definitivt någon att hålla ögonen på.',
        initials: 'TT',
    },
    {
        id: 2,
        name: 'Angelica Dahlqvist',
        title: '.NET-student',
        company: 'Teknikhögskolan',
        relationship: 'Bollplank',
        date: 'September 2024',
        quote:
            'Eftersom Maja kommer från en bakgrund som journalist så är hon också sjukt duktig på att både "gräva" fram saker men också analysera detta och se saker ur flera vinklar. Den information hon samlar ihop i sina analyser omvandlar hon sedan till information som hon förmedlar anpassad till mottagaren, perfekt nu när AI tar över själva kodandet mer och de sociala värdena blir viktigare för en arbetsgivare. Hon har också ett stort eget intresse för cybersäkerhet och man kan verkligen se hur hon brinner för det när hon pratar om det, det smittar av sig direkt och man vill direkt lära sig ännu mer själv. Utöver detta är Maja en sjukt driven människa som vill otroligt mycket, hon har många grymma idéer och hjälper gladeligen andra med sina.',
        initials: 'AD',
    },
    {
        id: 3,
        name: 'Thomas Tollstedt',
        title: '.NET-student',
        company: 'YH Akademin',
        relationship: 'Klasskamrat',
        date: 'Januari 2026',
        quote:
            'Maja är kommunikativ och är väldigt lättsam att interagera med, mycket trevligt! Hon håller en hög nivå på sina frågor/reflektioner samt projekt i samtliga kurser. Lägg till att hon mer än gärna hjälper andra studenter att bolla och felsöka sina projekt på sidan om sitt egna. Det märks att hon brinner och är duktig på att se helheten med kod och arkitektur!',
        initials: 'TT',
    },
  {
      id: 4,
      name: 'Linda Hedenljung',
      title: 'Grävande reporter och författare',
      company: 'Östersunds-Posten',
      relationship: 'Fd kollega',
      date: 'September 2024',
      quote:
          'Maja är en utmärkt och driven redigerare. Utöver det är hon en mycket trevlig person!',
      initials: 'LH',
  },
  {
    id: 5,
    name: 'Kaj Söderin',
    title: 'Reporter',
    company: 'Länstidningen Östersund',
    relationship: 'Fd kollega',
    date: 'Maj 2024',
    quote:
      'Maja såg till att allt fungerade smidigt och bra när en tidning blir till. Kunnig, driven och kompetent!',
    initials: 'KS',
  },
  {
      id: 6,
      name: 'Sabina Pettersson',
      title: 'Reporter',
      company: 'Arbetarbladet',
      relationship: 'Fd kollega',
      date: 'Juli 2024',
      quote:
          'Maja är jätteduktig vad gäller att jobba med print, hon är noggrann och papperstidningen ser välgjord ut. Trots att hon suttit på distans har hon kommit jättebra in i gruppen på Arbetarbladets redaktion, trevlig och social. Hon är snabb att se när det blivit fel i texter som man skickat iväg. Har varit jättekul att jobba med henne!',
      initials: 'SP',
  },
  {
    id: 7,
    name: 'Malin Palmqvist',
    title: 'Kulturredaktör och recensent',
    company: 'Länstidningen Östersund',
    relationship: 'Fd kollega',
    date: 'April 2024',
    quote:
      'Maja är noggrann, kreativ och intelligent. Väldigt rolig att jobba med på alla sätt.',
    initials: 'MP',
  },
];

const AVATAR_COLORS = ['#2a3a2a', '#1e2e3a', '#3a2a1e', '#2a1e3a', '#1e3a2e'];

function Recommendations() {
  return (
    <div className="rec">
      <header className="rec__header">
        <div className="rec__header-inner">
          <p className="rec__page-label">Don&rsquo;t take my word for it</p>          
        </div>
      </header>

      <div className="rec__scroll-hint" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 1v12M2 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Scroll to read
      </div>

      <div
        className="rec__cards"
        style={{ '--card-count': recommendations.length } as CSSProperties}
      >
        {recommendations.map((rec, index) => (
          <article
            key={rec.id}
            className="rec__card"
            aria-label={`Recommendation from ${rec.name}`}
            style={{ '--card-glow': `rgba(6, 69, 22, ${0.12 + index * 0.03})` } as CSSProperties}
          >
            <span className="rec__quote-mark" aria-hidden="true">&ldquo;</span>
            <div className="rec__card-quote">
              <p className="rec__quote-text">{rec.quote}</p>
            </div>

            <footer className="rec__card-meta">
              <div
                className="rec__avatar-placeholder"
                style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
                aria-hidden="true"
              >
                {rec.initials}
              </div>
              <div className="rec__person-info">
                <span className="rec__person-name">{rec.name}</span>
                <span className="rec__person-role">{rec.title} · {rec.company}</span>
              </div>
              <span className="rec__relation-badge">{rec.relationship}</span>
            </footer>
          </article>
        ))}
      </div>

    </div>
  );
}

export default Recommendations;
