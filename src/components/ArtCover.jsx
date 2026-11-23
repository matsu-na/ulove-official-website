import { useId } from 'react'

const INK = '#161616'
const PAPER = '#f7f1e4'
const LIME = '#d8ff4f'
const VIOLET = '#7a5cff'
const CORAL = '#ff5b4d'
const SKY = '#7fd8ff'
const YELLOW = '#ffd84d'
const PINK = '#ffb7d5'

function Dots({ id, color = INK, opacity = 0.2, x = 0, y = 0 }) {
  return (
    <>
      <defs>
        <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill={color} />
        </pattern>
      </defs>
      <rect x={x} y={y} width="600" height="420" fill={`url(#${id})`} opacity={opacity} />
    </>
  )
}

function EyeArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={LIME} />
      <Dots id={`${uid}-dots`} opacity={0.28} />
      <g transform="rotate(-4 300 205)">
        <path d="M64 208C152 73 438 55 536 205C450 344 166 360 64 208Z" fill={PAPER} stroke={INK} strokeWidth="8" />
        <path d="M118 208C190 123 402 109 482 206" fill="none" stroke={INK} strokeWidth="4" />
        <circle cx="300" cy="207" r="94" fill={INK} />
        <circle cx="300" cy="207" r="72" fill={VIOLET} />
        <circle cx="300" cy="207" r="38" fill={INK} />
        <circle cx="270" cy="178" r="22" fill={PAPER} />
        <circle cx="329" cy="234" r="9" fill={LIME} />
        <path d="M208 110l12-34M262 92l5-39M338 91l-2-40M392 108l-11-36" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      </g>
      <g fill={INK} fontFamily="Archivo Black, sans-serif">
        <text x="38" y="66" fontSize="19" letterSpacing="4">YOUGU EXPO</text>
        <text x="38" y="378" fontSize="43" letterSpacing="-1">SEE YOU</text>
        <text x="38" y="409" fontSize="18" letterSpacing="4">IN THE VALLEY / 2026</text>
        <text x="536" y="386" fontSize="13" letterSpacing="2" transform="rotate(-90 536 386)">12.19—12.21</text>
      </g>
      <path d="M505 58l5 17 17 5-17 5-5 17-5-17-17-5 17-5 5-17Z" fill={CORAL} stroke={INK} strokeWidth="2" />
    </>
  )
}

function TicketArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={CORAL} />
      <Dots id={`${uid}-dots`} color={PAPER} opacity={0.2} />
      <circle cx="60" cy="60" r="110" fill={YELLOW} opacity="0.9" />
      <g transform="rotate(-6 300 210)">
        <rect x="72" y="105" width="456" height="218" rx="20" fill={PAPER} stroke={INK} strokeWidth="6" />
        <path d="M362 105v218" stroke={INK} strokeWidth="3" strokeDasharray="9 9" />
        <circle cx="362" cy="105" r="15" fill={CORAL} stroke={INK} strokeWidth="5" />
        <circle cx="362" cy="323" r="15" fill={CORAL} stroke={INK} strokeWidth="5" />
        <g fill={INK} fontFamily="Archivo Black, sans-serif">
          <text x="103" y="154" fontSize="17" letterSpacing="4">YOUGU COMIC CON</text>
          <text x="100" y="218" fontSize="55" letterSpacing="-2">EARLY</text>
          <text x="100" y="270" fontSize="55" letterSpacing="-2">BIRD</text>
          <text x="102" y="298" fontSize="13" letterSpacing="2">ADMIT ONE · SHANGHAI 2026</text>
        </g>
        <g fill={INK}>
          <rect x="390" y="145" width="8" height="112" />
          <rect x="405" y="145" width="3" height="112" />
          <rect x="414" y="145" width="11" height="112" />
          <rect x="432" y="145" width="4" height="112" />
          <rect x="443" y="145" width="8" height="112" />
          <rect x="457" y="145" width="3" height="112" />
          <rect x="466" y="145" width="13" height="112" />
          <rect x="486" y="145" width="5" height="112" />
        </g>
        <text x="389" y="286" fill={INK} fontFamily="Space Grotesk, sans-serif" fontSize="12" letterSpacing="1">NO. 2026 - 1219</text>
      </g>
      <path d="M526 55l6 20 20 6-20 6-6 20-6-20-20-6 20-6 6-20Z" fill={LIME} stroke={INK} strokeWidth="2" />
    </>
  )
}

function SunArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={VIOLET} />
      <Dots id={`${uid}-dots`} color={INK} opacity={0.18} />
      <g stroke={INK} strokeWidth="5">
        <circle cx="300" cy="270" r="168" fill={YELLOW} />
        <circle cx="300" cy="270" r="128" fill={CORAL} />
        <circle cx="300" cy="270" r="84" fill={PAPER} />
        <path d="M300 48v42M300 402v-32M78 270h38M484 270h38M139 109l30 30M431 401l30 30M461 109l-30 30M169 401l-30 30" strokeLinecap="round" />
      </g>
      <path d="M0 352h600v68H0z" fill={INK} />
      <text x="34" y="395" fill={PAPER} fontFamily="Archivo Black, sans-serif" fontSize="22" letterSpacing="4">MAIN STAGE / 48 EVENTS</text>
      <text x="35" y="54" fill={PAPER} fontFamily="Archivo Black, sans-serif" fontSize="20" letterSpacing="4">SUN. RISING</text>
      <path d="M497 56l7 22 22 7-22 7-7 22-7-22-22-7 22-7 7-22Z" fill={LIME} stroke={INK} strokeWidth="2" />
    </>
  )
}

function GridArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={YELLOW} />
      <Dots id={`${uid}-dots`} opacity={0.2} />
      <g stroke={INK} strokeWidth="2" opacity="0.8">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 75} 0v420`} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 84}h600`} />
        ))}
      </g>
      <circle cx="440" cy="122" r="78" fill={CORAL} stroke={INK} strokeWidth="5" />
      <circle cx="440" cy="122" r="34" fill={PAPER} stroke={INK} strokeWidth="5" />
      <g fill={INK} fontFamily="Archivo Black, sans-serif">
        <text x="42" y="154" fontSize="34" letterSpacing="2">DOUJIN</text>
        <text x="38" y="306" fontSize="164" letterSpacing="-12">320</text>
      </g>
      <rect x="44" y="338" width="149" height="42" rx="21" fill={PAPER} stroke={INK} strokeWidth="3" />
      <text x="65" y="365" fill={INK} fontFamily="Space Grotesk, sans-serif" fontWeight="600" fontSize="16" letterSpacing="2">MAKERS</text>
      <path d="M491 277l7 21 21 7-21 7-7 21-7-21-21-7 21-7 7-21Z" fill={LIME} stroke={INK} strokeWidth="2" />
    </>
  )
}

function TrainArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={SKY} />
      <Dots id={`${uid}-dots`} color={INK} opacity={0.15} />
      <path d="M40 314h520" stroke={INK} strokeWidth="8" />
      <path d="M40 314h520" stroke={PAPER} strokeWidth="3" strokeDasharray="14 10" />
      {[80, 190, 300, 410, 520].map((x) => (
        <g key={x}>
          <circle cx={x} cy="314" r="10" fill={PAPER} stroke={INK} strokeWidth="4" />
          <circle cx={x} cy="314" r="3" fill={INK} />
        </g>
      ))}
      <g transform="translate(178 108)">
        <rect x="0" y="0" width="244" height="172" rx="42" fill={PAPER} stroke={INK} strokeWidth="6" />
        <rect x="23" y="26" width="198" height="66" rx="14" fill={VIOLET} stroke={INK} strokeWidth="4" />
        <path d="M62 26v66M122 26v66M182 26v66" stroke={INK} strokeWidth="4" />
        <circle cx="58" cy="135" r="16" fill={CORAL} stroke={INK} strokeWidth="5" />
        <circle cx="186" cy="135" r="16" fill={CORAL} stroke={INK} strokeWidth="5" />
        <path d="M85 118h74" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <path d="M38 172l-20 40M206 172l20 40" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      </g>
      <g fill={INK} fontFamily="Archivo Black, sans-serif">
        <text x="34" y="57" fontSize="19" letterSpacing="4">CITY LINE / 02</text>
        <text x="32" y="393" fontSize="27" letterSpacing="1">NEXT STOP: THE VALLEY</text>
      </g>
      <path d="M510 58l6 20 20 6-20 6-6 20-6-20-20-6 20-6 6-20Z" fill={LIME} stroke={INK} strokeWidth="2" />
    </>
  )
}

function StarArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={LIME} />
      <Dots id={`${uid}-dots`} opacity={0.22} />
      <g transform="translate(300 205)">
        <path d="M0-172 36-50 158-50 60 22 98 144 0 70-98 144-60 22-158-50-36-50Z" fill={PAPER} stroke={INK} strokeWidth="7" />
        <path d="M0-74 15-24 65-24 25 6 40 56 0 28-40 56-25 6-65-24-15-24Z" fill={CORAL} stroke={INK} strokeWidth="4" />
      </g>
      <g fill={INK} fontFamily="Archivo Black, sans-serif">
        <text x="33" y="55" fontSize="18" letterSpacing="4">JOIN THE CREW</text>
        <text x="32" y="392" fontSize="17" letterSpacing="3">120 VOLUNTEERS · ONE VALLEY</text>
      </g>
      <text x="522" y="74" fill={INK} fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="15" transform="rotate(90 522 74)">BE A LIGHT</text>
    </>
  )
}

function MoonArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={INK} />
      <Dots id={`${uid}-dots`} color={PAPER} opacity={0.16} />
      <circle cx="425" cy="158" r="110" fill={PINK} />
      <circle cx="463" cy="126" r="105" fill={INK} />
      <g fill={PAPER}>
        <circle cx="86" cy="78" r="3" />
        <circle cx="171" cy="132" r="2" />
        <circle cx="247" cy="53" r="3" />
        <circle cx="531" cy="61" r="2" />
        <circle cx="80" cy="233" r="2" />
        <circle cx="544" cy="266" r="3" />
      </g>
      <path d="M0 326h600" stroke={VIOLET} strokeWidth="2" />
      <path d="M0 352h600M0 386h600" stroke={VIOLET} strokeWidth="14" opacity="0.45" />
      <g fill={PAPER} fontFamily="Archivo Black, sans-serif">
        <text x="34" y="270" fontSize="47" letterSpacing="-1">STARDUST</text>
        <text x="36" y="309" fontSize="24" letterSpacing="6">ECHO / LIVE</text>
        <text x="36" y="408" fontSize="13" letterSpacing="3" fill={SKY}>12.20 19:00 · HALL 6.2</text>
      </g>
      <path d="M509 196l5 16 16 5-16 5-5 16-5-16-16-5 16-5 5-16Z" fill={LIME} />
    </>
  )
}

function WaveArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={VIOLET} />
      <Dots id={`${uid}-dots`} color={PAPER} opacity={0.15} />
      <path d="M0 220c70-70 150-70 220 0s150 70 220 0 120-54 160-24v224H0Z" fill={LIME} />
      <path d="M0 300c70-64 146-64 216 0s150 64 220 0 126-46 164-16v136H0Z" fill={CORAL} />
      <path d="M0 356c74-48 144-48 218 0s148 48 218 0 126-36 164-8v72H0Z" fill={PAPER} />
      <g fill={INK} fontFamily="Archivo Black, sans-serif">
        <text x="36" y="70" fontSize="21" letterSpacing="4">EVERYONE</text>
        <text x="36" y="104" fontSize="21" letterSpacing="4">WELCOME</text>
        <text x="34" y="410" fontSize="12" letterSpacing="2">ACCESSIBILITY GUIDE · YOUGU 2026</text>
      </g>
      <g fill="none" stroke={INK} strokeWidth="4">
        <circle cx="500" cy="79" r="38" />
        <path d="M500 57v28l18 12" strokeLinecap="round" />
      </g>
    </>
  )
}

function PainbagArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={PINK} />
      <Dots id={`${uid}-dots`} color={CORAL} opacity={0.3} />
      <g transform="rotate(-3 300 210)">
        <path d="M166 156c0-68 55-108 134-108s134 40 134 108" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <rect x="108" y="144" width="384" height="228" rx="46" fill={PAPER} stroke={INK} strokeWidth="7" />
        <rect x="132" y="168" width="336" height="180" rx="30" fill={LIME} stroke={INK} strokeWidth="4" />
        <circle cx="230" cy="238" r="42" fill={CORAL} stroke={INK} strokeWidth="4" />
        <path d="M214 237l13 13 24-29" fill="none" stroke={PAPER} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="353" cy="266" r="33" fill={SKY} stroke={INK} strokeWidth="4" />
        <path d="M340 257c5-10 21-10 26 0M340 277h27" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M305 194l5 15 15 5-15 5-5 15-5-15-15-5 15-5 5-15Z" fill={YELLOW} stroke={INK} strokeWidth="3" />
        <text x="407" y="224" fill={INK} fontFamily="Archivo Black, sans-serif" fontSize="13" transform="rotate(12 407 224)">GO!</text>
      </g>
      <text x="34" y="57" fill={INK} fontFamily="Archivo Black, sans-serif" fontSize="19" letterSpacing="4">PAINBAG LAB</text>
      <text x="34" y="401" fill={INK} fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="14" letterSpacing="3">HANDMADE / 001</text>
    </>
  )
}

function StickerArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={YELLOW} />
      <Dots id={`${uid}-dots`} color={CORAL} opacity={0.35} />
      <g transform="rotate(-4 300 220)">
        <rect x="102" y="74" width="396" height="300" rx="18" fill={PAPER} stroke={INK} strokeWidth="6" />
        <circle cx="202" cy="169" r="59" fill={LIME} stroke={INK} strokeWidth="5" />
        <circle cx="202" cy="169" r="35" fill={CORAL} stroke={INK} strokeWidth="4" />
        <circle cx="190" cy="160" r="6" fill={PAPER} />
        <circle cx="342" cy="166" r="55" fill={VIOLET} stroke={INK} strokeWidth="5" />
        <path d="M329 151l7 19 19 7-19 7-7 19-7-19-19-7 19-7 7-19Z" fill={PAPER} />
        <path d="M200 287c15-32 54-32 68 0" fill={SKY} stroke={INK} strokeWidth="4" />
        <circle cx="217" cy="282" r="4" fill={INK} />
        <circle cx="251" cy="282" r="4" fill={INK} />
        <path d="M314 270h56v45h-56z" fill={CORAL} stroke={INK} strokeWidth="4" />
        <path d="M327 289h30" stroke={PAPER} strokeWidth="6" strokeLinecap="round" />
        <text x="127" y="350" fill={INK} fontFamily="Archivo Black, sans-serif" fontSize="13" letterSpacing="3">FREE STICKER SHEET</text>
      </g>
      <path d="M61 58l6 19 19 6-19 6-6 19-6-19-19-6 19-6 6-19Z" fill={LIME} stroke={INK} strokeWidth="2" />
    </>
  )
}

function GuideArt({ uid }) {
  return (
    <>
      <rect width="600" height="420" fill={PAPER} />
      <Dots id={`${uid}-dots`} color={INK} opacity={0.12} />
      <circle cx="510" cy="95" r="75" fill={VIOLET} />
      <g transform="rotate(4 300 220)">
        <rect x="100" y="58" width="340" height="324" rx="10" fill={PAPER} stroke={INK} strokeWidth="6" />
        <rect x="100" y="58" width="340" height="45" rx="10" fill={LIME} stroke={INK} strokeWidth="6" />
        <text x="124" y="88" fill={INK} fontFamily="Archivo Black, sans-serif" fontSize="16" letterSpacing="3">MY QUIET GUIDE</text>
        {[145, 199, 253, 307].map((y, i) => (
          <g key={y}>
            <rect x="127" y={y} width="25" height="25" rx="5" fill="none" stroke={INK} strokeWidth="3" />
            {i < 3 && <path d={`M133 ${y + 12}l7 7 14-16`} fill="none" stroke={CORAL} strokeWidth="4" strokeLinecap="round" />}
            <path d={`M172 ${y + 6}h210M172 ${y + 18}h${i === 0 ? 150 : 176}`} stroke={INK} strokeWidth="4" strokeLinecap="round" opacity="0.75" />
          </g>
        ))}
        <circle cx="189" cy="349" r="12" fill={CORAL} />
        <text x="216" y="355" fill={INK} fontFamily="Space Grotesk, sans-serif" fontWeight="600" fontSize="11">TAKE A BREATH ANYTIME</text>
      </g>
      <text x="33" y="401" fill={INK} fontFamily="Archivo Black, sans-serif" fontSize="13" letterSpacing="3">SOCIAL BATTERY / SAVE POINT</text>
    </>
  )
}

export default function ArtCover({ variant = 'eye', label = 'YOUGU', accent = 'lime', className = '' }) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const art = {
    eye: <EyeArt uid={uid} />,
    ticket: <TicketArt uid={uid} />,
    sun: <SunArt uid={uid} />,
    grid: <GridArt uid={uid} />,
    train: <TrainArt uid={uid} />,
    star: <StarArt uid={uid} />,
    moon: <MoonArt uid={uid} />,
    wave: <WaveArt uid={uid} />,
    painbag: <PainbagArt uid={uid} />,
    sticker: <StickerArt uid={uid} />,
    guide: <GuideArt uid={uid} />,
  }[variant] ?? <EyeArt uid={uid} />

  return (
    <div className={`art-cover art-cover--${accent} ${className}`}>
      <svg viewBox="0 0 600 420" role="img" aria-label={`${label} 主题视觉`} preserveAspectRatio="xMidYMid slice">
        {art}
      </svg>
      <span className="art-cover__label">{label}</span>
    </div>
  )
}
