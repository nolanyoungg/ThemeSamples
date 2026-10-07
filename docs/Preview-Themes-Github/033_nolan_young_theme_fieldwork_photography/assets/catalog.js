/* Shared, fictional service and print catalogue. Prices are integer cents. */
window.Fieldwork = {
  services: {
    pets: {
      label: "Pets",
      kicker: "For the ones with paws",
      title: ["Small paws.", "Big personality."],
      tagline: "The muddy paws. The tilted head. The entirely individual soul.",
      description:
        "Playful, patient photographs of your favourite companion, with room to sniff, wander, and just be themselves.",
      images: ["pets-sunset.jpg", "pets-garden.jpg"],
      hero: "pets-sunset.jpg",
      duration: "45–90 minute sessions",
      intro: "All personality. No perfect behaviour required.",
      body: [
        "We begin with a little time to settle in. A familiar walk, a favourite toy, a few treats. The best moments often happen before anyone asks for a pose.",
        "The session moves at your pet’s pace. We leave room for breaks, keep the setting simple, and look for the expressions you recognise instantly. Dogs, cats, and their favourite people are all part of the story.",
      ],
      packages: [
        {
          name: "The companion session",
          price: 27500,
          features: [
            "45 minutes in one familiar location",
            "One pet and their person",
            "15 edited digital photographs",
            "A private viewing gallery",
          ],
        },
        {
          name: "A little more adventure",
          price: 45000,
          features: [
            "90 minutes with room to explore",
            "Up to three pets from one household",
            "30 edited digital photographs",
            "A mix of portraits and playful moments",
          ],
        },
      ],
      faq: [
        [
          "What if my pet will not sit still?",
          "That is part of their personality. The sample session approach uses movement, play, and patient pauses instead of expecting a perfect pose.",
        ],
        [
          "Can I be in the photographs too?",
          "Absolutely. The relationship between you and your pet is often the most meaningful part of the story. Both sample packages include their people.",
        ],
        [
          "What should I bring?",
          "A favourite toy, treats you know your pet enjoys, water, and their usual lead or carrier. Familiar things help the session feel like an ordinary good day.",
        ],
      ],
    },
    portraits: {
      label: "Portraits",
      kicker: "Personal / professional / creative",
      title: ["You, as", "you are."],
      tagline:
        "A little direction. A little space. Something unmistakably you.",
      description:
        "Thoughtful portraits for a new chapter, a creative practice, a professional introduction, or simply this moment in your life.",
      images: ["portrait-natural.jpg", "portrait-mono.jpg"],
      hero: "portrait-natural.jpg",
      duration: "45–90 minute sessions",
      intro: "A portrait should feel like a person.",
      body: [
        "You do not need to know what to do with your hands. We begin with a conversation, find comfortable light, and offer clear, gentle direction along the way.",
        "The aim is a useful, personal collection: a clean introduction, a little movement, an expression that feels familiar. Bring the clothes and objects that belong to your own story.",
      ],
      packages: [
        {
          name: "The introduction",
          price: 32500,
          features: [
            "45 minutes at one location",
            "One person, two outfit choices",
            "12 edited digital portraits",
            "Web and high-resolution files",
          ],
        },
        {
          name: "The fuller picture",
          price: 52500,
          features: [
            "90 minutes for a personal brand story",
            "Up to three outfit choices",
            "25 edited digital photographs",
            "A mix of portraits and working details",
          ],
        },
      ],
      faq: [
        [
          "I am not comfortable in front of a camera.",
          "Most people are not at first. The session is built around conversation and simple direction, with time to get comfortable before making the final pictures.",
        ],
        [
          "Can this be a professional headshot session?",
          "Yes. The introduction package is designed to include clean, straightforward images for a website, profile, or professional biography.",
        ],
        [
          "How much retouching is included?",
          "The sample approach includes colour, exposure, and light finishing while keeping natural detail. Any specific retouching request would be discussed before a real session.",
        ],
      ],
    },
    family: {
      label: "Families",
      kicker: "The people who make it home",
      title: ["The beautiful", "in-between."],
      tagline: "The real laughter. The small hands. The way you are together.",
      description:
        "Relaxed family photographs with a little direction and plenty of room for the moments that cannot be planned.",
      images: ["family-play.jpg", "family-shore.jpg"],
      hero: "family-shore.jpg",
      duration: "60–90 minute sessions",
      intro: "Less “say cheese”. More being together.",
      body: [
        "We make space for a walk, a game, a story, a quiet cuddle. A few gently arranged portraits sit alongside the small, unplanned moments that make a family feel like itself.",
        "Choose a place that makes sense for your people: a familiar park, a favourite stretch of beach, or the rooms where your everyday life happens. The setting is there to support the story.",
      ],
      packages: [
        {
          name: "An hour together",
          price: 37500,
          features: [
            "60 minutes in one location",
            "One household, up to six people",
            "25 edited digital photographs",
            "Portraits and candid moments",
          ],
        },
        {
          name: "The whole gathering",
          price: 65000,
          features: [
            "90 minutes for the extended family",
            "Up to twelve people",
            "45 edited digital photographs",
            "Smaller groupings and a full family portrait",
          ],
        },
      ],
      faq: [
        [
          "What if the children need a break?",
          "We leave room for that. A snack, a game, or a short walk can be part of the rhythm of the session. The plan is flexible enough for real family life.",
        ],
        [
          "Should our outfits match?",
          "They do not need to. Comfortable clothes in a few complementary colours usually feel more like your family than identical outfits.",
        ],
        [
          "Can we include grandparents or pets?",
          "Yes. Mention everyone you would like included in the session enquiry so the right sample package and pace can be suggested.",
        ],
      ],
    },
    homes: {
      label: "Homes & real estate",
      kicker: "Architecture / interiors / property",
      title: ["Every room,", "a point of view."],
      tagline: "Honest spaces. Considered light. A clear sense of place.",
      description:
        "Interior, exterior, and property photography that helps a space make a thoughtful first impression.",
      images: ["home-minimal.jpg", "home-sunlit.jpg"],
      hero: "home-minimal.jpg",
      duration: "Property and editorial coverage",
      intro: "Show the space. Keep its character.",
      body: [
        "A room is more than its dimensions. We look for natural transitions, useful sightlines, details of material, and the light that gives a space its personality.",
        "The approach balances broad views with the smaller details that make a listing or design story feel complete. Before a real booking, access, room count, shot list, and intended usage would be confirmed.",
      ],
      packages: [
        {
          name: "The listing collection",
          price: 22500,
          features: [
            "Interior and exterior photographs",
            "Homes up to 2,000 square feet",
            "20 edited listing images",
            "Web-ready and high-resolution delivery",
          ],
        },
        {
          name: "The property story",
          price: 45000,
          features: [
            "Extended coverage up to 4,000 square feet",
            "35 edited photographs",
            "Architectural details and feature rooms",
            "A tailored shot list and usage discussion",
          ],
        },
      ],
      faq: [
        [
          "How should the property be prepared?",
          "Clear countertops, open curtains, make beds, and remove personal paperwork. A short preparation checklist helps make the most of the scheduled time.",
        ],
        [
          "Are floor plans or aerial images included?",
          "They are not included in these sample packages. Any specialist coverage would need to be scoped separately rather than assumed.",
        ],
        [
          "Can the photos be used for a design portfolio?",
          "That can be discussed when planning the brief. Listing, architectural, and commercial usage have different needs; a real agreement would define the intended use.",
        ],
      ],
    },
    events: {
      label: "Events",
      kicker: "Gatherings / celebrations / launches",
      title: ["Be there.", "We’ll keep it."],
      tagline: "The atmosphere, the details, and the moments you did not see.",
      description:
        "Attentive event coverage that lets you stay part of the occasion, with photographs that bring the whole story back.",
      images: ["event-celebration.jpg", "event-tables.jpg"],
      hero: "event-tables.jpg",
      duration: "Two-hour and four-hour coverage",
      intro: "An event has a rhythm. We follow it.",
      body: [
        "We begin with the shape of the day: the people to look out for, the moments that matter, and the details that took time to make. Then we move quietly through the gathering.",
        "A complete set includes establishing photographs, candid interactions, key moments, and any agreed group portraits. Corporate gatherings, private celebrations, and community events each get their own considered brief.",
      ],
      packages: [
        {
          name: "The gathering",
          price: 65000,
          features: [
            "Two hours of continuous coverage",
            "One photographer, one venue",
            "60 edited digital photographs",
            "A balanced story of people and details",
          ],
        },
        {
          name: "The full occasion",
          price: 125000,
          features: [
            "Four hours of continuous coverage",
            "A planning call and priority shot list",
            "120 edited digital photographs",
            "Key moments, groups, atmosphere, and details",
          ],
        },
      ],
      faq: [
        [
          "Can we provide a shot list?",
          "Yes. A concise list of essential people, moments, and group photographs helps shape the brief without turning every minute into a schedule.",
        ],
        [
          "Do you photograph business events?",
          "The sample offering includes launches, team gatherings, and community events. The intended use of the images would be agreed before a real commission.",
        ],
        [
          "Is full wedding coverage included?",
          "These packages are designed for events and smaller celebrations. A full wedding would need its own brief, timing, and coverage agreement.",
        ],
      ],
    },
  },
  photos: {
    "pets-sunset.jpg": {
      id: 4725941,
      source:
        "https://www.pexels.com/photo/golden-retriever-on-brown-grass-field-4725941/",
      credit: "Helena Lopes",
      alt: "A golden retriever in a meadow beneath a low evening sun",
      category: "pets",
      width: 1800,
      height: 1200,
    },
    "pets-garden.jpg": {
      id: 2408649,
      source: "https://www.pexels.com/photo/close-up-photo-of-dog-2408649/",
      credit: "Mithul Varshan",
      alt: "A golden retriever looking up from a green garden",
      category: "pets",
      width: 1800,
      height: 1350,
    },
    "portrait-mono.jpg": {
      id: 29933012,
      source:
        "https://www.pexels.com/photo/portrait-of-a-smiling-woman-in-outdoor-setting-29933012/",
      credit: "P G",
      alt: "Black-and-white portrait of a smiling woman outdoors",
      category: "portraits",
      width: 1800,
      height: 3200,
    },
    "portrait-natural.jpg": {
      id: 32022107,
      source:
        "https://www.pexels.com/photo/portrait-of-a-woman-outdoors-with-natural-background-32022107/",
      credit: "Mayra Lopes",
      alt: "A woman looking toward the camera beside a tree in natural light",
      category: "portraits",
      width: 1800,
      height: 2700,
    },
    "family-play.jpg": {
      id: 4452208,
      source:
        "https://www.pexels.com/photo/black-and-white-photo-of-a-happy-family-walking-on-the-shore-of-a-beach-4452208/",
      credit: "Nataliya Vaitkevich",
      alt: "Black-and-white photograph of parents playing with their young child at the beach",
      category: "family",
      width: 1800,
      height: 2700,
    },
    "family-shore.jpg": {
      id: 3968116,
      source:
        "https://www.pexels.com/photo/father-and-child-walking-on-seashore-3968116/",
      credit: "Tatiana Syrikova",
      alt: "A father and child walking beside the sea in evening light",
      category: "family",
      width: 1800,
      height: 2700,
    },
    "home-sunlit.jpg": {
      id: 37192236,
      source:
        "https://www.pexels.com/photo/spacious-modern-living-room-interior-design-37192236/",
      credit: "Peter Vang",
      alt: "A bright living room with pale sofas, tall windows, and a wooden railing",
      category: "homes",
      width: 1800,
      height: 1012,
    },
    "home-minimal.jpg": {
      id: 1571460,
      source:
        "https://www.pexels.com/photo/interior-design-of-a-house-1571460/",
      credit: "Viaceslav Kat",
      alt: "A contemporary living room with a pale sofa and a floating wooden staircase",
      category: "homes",
      width: 1800,
      height: 1157,
    },
    "event-tables.jpg": {
      id: 9714791,
      source:
        "https://www.pexels.com/photo/tables-prepared-for-a-party-with-decorative-lights-and-garlands-9714791/",
      credit: "Jonathan Borba",
      alt: "An event space set with wooden tables, flowers, and warm hanging lights",
      category: "events",
      width: 1800,
      height: 1200,
    },
    "event-celebration.jpg": {
      id: 6405655,
      source:
        "https://www.pexels.com/photo/people-celebrating-happily-6405655/",
      credit: "Pavel Danilyuk",
      alt: "A group of adults laughing together at an indoor celebration",
      category: "events",
      width: 1800,
      height: 1202,
    },
  },
  prints: {
    forest: {
      title: "Fontainebleau Forest",
      originalTitle: "[Fontainebleau Forest]",
      artist: "Eugène Cuvelier",
      date: "early 1860s",
      image: "print-forest.jpg",
      orientation: "landscape",
      source: "https://www.metmuseum.org/art/collection/search/265904",
      description:
        "Soft light, a quiet clearing, and the intricate shape of branches. A woodland study from the public photographic archive.",
      number: "01",
    },
    yosemite: {
      title: "General View of Yosemite",
      originalTitle: "General View of Yosemite",
      artist: "Attributed to Carleton E. Watkins",
      date: "ca. 1872, printed ca. 1876",
      image: "print-yosemite.jpg",
      orientation: "portrait",
      source: "https://www.metmuseum.org/art/collection/search/264903",
      description:
        "Granite, distance, and a small stand of trees. A nineteenth-century view of Yosemite, reproduced with its original photographic margins.",
      number: "02",
    },
    cape: {
      title: "Cape Horn, Columbia River",
      originalTitle: "Cape Horn, Columbia River, Oregon",
      artist: "Carleton E. Watkins",
      date: "1867",
      image: "print-cape-horn.jpg",
      orientation: "portrait",
      source: "https://www.metmuseum.org/art/collection/search/286513",
      description:
        "A rock face reflected in still water. A measured study of light and scale from Watkins’s Columbia River photographs.",
      number: "03",
    },
  },
  sizes: [
    {
      label: "8 × 10",
      short: 8,
      long: 10,
      price: 3500,
    },
    {
      label: "10 × 16",
      short: 10,
      long: 16,
      price: 5500,
    },
    {
      label: "11 × 14",
      short: 11,
      long: 14,
      price: 6500,
    },
    {
      label: "12 × 18",
      short: 12,
      long: 18,
      price: 7500,
    },
    {
      label: "16 × 20",
      short: 16,
      long: 20,
      price: 9000,
    },
    {
      label: "18 × 24",
      short: 18,
      long: 24,
      price: 11000,
    },
    {
      label: "20 × 30",
      short: 20,
      long: 30,
      price: 14000,
    },
  ],
  frames: {
    none: {
      label: "Unframed",
      color: "transparent",
      prices: [0, 0, 0, 0, 0, 0, 0],
    },
    black: {
      label: "Black",
      color: "#252525",
      prices: [3500, 4500, 5000, 6000, 7500, 9000, 11000],
    },
    white: {
      label: "White",
      color: "#e5e4df",
      prices: [3500, 4500, 5000, 6000, 7500, 9000, 11000],
    },
    oak: {
      label: "Oak",
      color: "#aa835a",
      prices: [4500, 6000, 6500, 8000, 9500, 11000, 13500],
    },
  },
  finishes: {
    matte: {
      label: "Matte",
      price: 0,
    },
    lustre: {
      label: "Lustre",
      price: 800,
    },
  },
};
