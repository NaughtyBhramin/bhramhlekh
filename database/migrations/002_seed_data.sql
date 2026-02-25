-- =============================================================
-- Jyotish Darshan — Seed Data
-- Migration: 002_seed_data.sql
-- =============================================================

-- ── Planets ────────────────────────────────────────────────────
INSERT INTO planets (name, sanskrit, symbol, category, element, nature, day_ruled, gemstone, color, metal, mantra, description) VALUES
('Sun',     'Surya',   '☉', 'graha',  'Fire',  'malefic', 'Sunday',    'Ruby',           'Gold',       'Gold',   'Om Hraam Hreem Hraum Sah Suryaya Namah',       'The king of planets, represents soul, father, authority, and vitality'),
('Moon',    'Chandra', '☽', 'graha',  'Water', 'benefic', 'Monday',    'Pearl',          'White',      'Silver', 'Om Shraam Shreem Shraum Sah Chandraya Namah',  'Represents mind, mother, emotions, intuition, and domestic life'),
('Mars',    'Mangal',  '♂', 'graha',  'Fire',  'malefic', 'Tuesday',   'Red Coral',      'Red',        'Copper', 'Om Kraam Kreem Kraum Sah Bhauma Namah',        'Planet of energy, courage, property, siblings, and physical strength'),
('Mercury', 'Budha',   '☿', 'graha',  'Earth', 'neutral', 'Wednesday', 'Emerald',        'Green',      'Bronze', 'Om Braam Breem Braum Sah Budhaya Namah',       'Governs intellect, communication, business, and analytical thinking'),
('Jupiter', 'Guru',    '♃', 'graha',  'Ether', 'benefic', 'Thursday',  'Yellow Sapphire','Yellow',     'Gold',   'Om Graam Greem Graum Sah Gurave Namah',        'Guru of the gods, bestows wisdom, prosperity, children, and spirituality'),
('Venus',   'Shukra',  '♀', 'graha',  'Water', 'benefic', 'Friday',    'Diamond',        'White/Pink', 'Silver', 'Om Draam Dreem Draum Sah Shukraya Namah',      'Planet of love, beauty, luxury, arts, relationships, and material comforts'),
('Saturn',  'Shani',   '♄', 'graha',  'Air',   'malefic', 'Saturday',  'Blue Sapphire',  'Blue/Black', 'Iron',   'Om Praam Preem Praum Sah Shanaischaraya Namah','Planet of karma, discipline, delays, hardship, and ultimate liberation'),
('Rahu',    'Rahu',    '☊', 'shadow', 'Air',   'malefic', 'Saturday',  'Hessonite',      'Smoky',      'Lead',   'Om Bhram Bhreem Bhraum Sah Rahave Namah',      'North node of Moon — karmic desires, foreign connections, material ambition'),
('Ketu',    'Ketu',    '☋', 'shadow', 'Fire',  'malefic', 'Tuesday',   'Cat''s Eye',     'Multi',      'Lead',   'Om Sraam Sreem Sraum Sah Ketave Namah',        'South node of Moon — spirituality, moksha, past life karma, mysticism');

-- ── Rashis ─────────────────────────────────────────────────────
INSERT INTO rashis (name, english_name, symbol, ruling_planet, element, quality, gender, start_degree, end_degree, date_range, traits, body_parts, lucky_numbers, lucky_colors, lucky_gems, description, career_fields) VALUES
('Mesha',     'Aries',       '♈', 'Mars',    'Fire',  'Cardinal', 'Male',   0,   30,  'Mar 21 – Apr 19',
 ARRAY['Courageous','Dynamic','Leader','Impulsive','Energetic'],
 ARRAY['Head','Brain','Face'], ARRAY[1,9], ARRAY['Red','Scarlet'], ARRAY['Ruby','Red Coral'],
 'The first sign, ruled by Mars. Dynamic, pioneering, and full of raw energy. Natural leaders who charge forward with unmatched courage.',
 ARRAY['Military','Sports','Surgery','Engineering','Entrepreneurship']),

('Vrishabha', 'Taurus',      '♉', 'Venus',   'Earth', 'Fixed',    'Female', 30,  60,  'Apr 20 – May 20',
 ARRAY['Stable','Loyal','Sensual','Patient','Materialistic'],
 ARRAY['Throat','Neck','Voice'], ARRAY[2,6], ARRAY['Green','Pink'], ARRAY['Diamond','Emerald'],
 'The second sign, ruled by Venus. Deeply sensual, reliable, and pleasure-loving. Builds lasting foundations through patience and persistence.',
 ARRAY['Finance','Agriculture','Art','Music','Interior Design']),

('Mithuna',   'Gemini',      '♊', 'Mercury', 'Air',   'Mutable',  'Male',   60,  90,  'May 21 – Jun 20',
 ARRAY['Witty','Curious','Adaptable','Communicative','Restless'],
 ARRAY['Arms','Shoulders','Lungs','Hands'], ARRAY[3,5], ARRAY['Yellow','Light Green'], ARRAY['Emerald','Tourmaline'],
 'The third sign, ruled by Mercury. Quick-witted, versatile, and eternally curious. Masters of communication who can see all sides.',
 ARRAY['Journalism','Teaching','Sales','IT','Writing','Public Relations']),

('Karka',     'Cancer',      '♋', 'Moon',    'Water', 'Cardinal', 'Female', 90,  120, 'Jun 21 – Jul 22',
 ARRAY['Nurturing','Intuitive','Emotional','Protective','Moody'],
 ARRAY['Chest','Stomach','Breasts'], ARRAY[2,7], ARRAY['White','Silver'], ARRAY['Pearl','Moonstone'],
 'The fourth sign, ruled by Moon. Deeply empathetic, intuitive, and home-loving. The cosmic nurturer who leads with the heart.',
 ARRAY['Healthcare','Psychology','Catering','Real Estate','Teaching','Social Work']),

('Simha',     'Leo',         '♌', 'Sun',     'Fire',  'Fixed',    'Male',   120, 150, 'Jul 23 – Aug 22',
 ARRAY['Regal','Generous','Creative','Proud','Dramatic'],
 ARRAY['Heart','Spine','Back'], ARRAY[1,4], ARRAY['Gold','Orange'], ARRAY['Ruby','Amber'],
 'The fifth sign, ruled by Sun. Noble, generous, and supremely confident. Born leaders who shine at the center of attention.',
 ARRAY['Politics','Entertainment','Management','Education','Arts','Administration']),

('Kanya',     'Virgo',       '♍', 'Mercury', 'Earth', 'Mutable',  'Female', 150, 180, 'Aug 23 – Sep 22',
 ARRAY['Analytical','Precise','Helpful','Critical','Practical'],
 ARRAY['Intestines','Digestive System','Navel'], ARRAY[5,6], ARRAY['Navy Blue','Green'], ARRAY['Emerald'],
 'The sixth sign, ruled by Mercury. Meticulous, service-oriented, and deeply analytical. The healer and perfectionist of the zodiac.',
 ARRAY['Medicine','Nutrition','Accounting','Research','Editing','Data Analysis']),

('Tula',      'Libra',       '♎', 'Venus',   'Air',   'Cardinal', 'Male',   180, 210, 'Sep 23 – Oct 22',
 ARRAY['Balanced','Fair','Social','Diplomatic','Indecisive'],
 ARRAY['Kidneys','Lower Back','Skin'], ARRAY[6,9], ARRAY['Pink','Pastel Blue'], ARRAY['Diamond','Opal'],
 'The seventh sign, ruled by Venus. Seeks harmony, beauty, and justice in all things. The diplomat and aesthete of the cosmos.',
 ARRAY['Law','Diplomacy','Fashion','Interior Design','HR','Counseling']),

('Vrischika', 'Scorpio',     '♏', 'Mars',    'Water', 'Fixed',    'Female', 210, 240, 'Oct 23 – Nov 21',
 ARRAY['Intense','Perceptive','Transformative','Secretive','Passionate'],
 ARRAY['Reproductive Organs','Bladder','Colon'], ARRAY[8,9], ARRAY['Deep Red','Maroon'], ARRAY['Red Coral','Hessonite'],
 'The eighth sign, ruled by Mars. Intensely perceptive, deeply emotional, and powerfully transformative. The phoenix of the zodiac.',
 ARRAY['Research','Psychology','Surgery','Occult','Finance','Investigation']),

('Dhanu',     'Sagittarius', '♐', 'Jupiter', 'Fire',  'Mutable',  'Male',   240, 270, 'Nov 22 – Dec 21',
 ARRAY['Philosophical','Adventurous','Optimistic','Blunt','Freedom-Loving'],
 ARRAY['Hips','Thighs','Liver'], ARRAY[3,9], ARRAY['Yellow','Purple'], ARRAY['Yellow Sapphire'],
 'The ninth sign, ruled by Jupiter. Endlessly optimistic, freedom-loving, and philosophically minded. The eternal seeker of truth.',
 ARRAY['Philosophy','Teaching','Travel','Law','Religion','Publishing']),

('Makara',    'Capricorn',   '♑', 'Saturn',  'Earth', 'Cardinal', 'Female', 270, 300, 'Dec 22 – Jan 19',
 ARRAY['Disciplined','Ambitious','Patient','Practical','Reserved'],
 ARRAY['Knees','Bones','Skin'], ARRAY[8,10], ARRAY['Black','Dark Blue'], ARRAY['Blue Sapphire','Onyx'],
 'The tenth sign, ruled by Saturn. Supremely disciplined, ambitious, and patient. The master builder who achieves through perseverance.',
 ARRAY['Government','Banking','Engineering','Architecture','Management','Law']),

('Kumbha',    'Aquarius',    '♒', 'Saturn',  'Air',   'Fixed',    'Male',   300, 330, 'Jan 20 – Feb 18',
 ARRAY['Innovative','Humanitarian','Visionary','Rebellious','Detached'],
 ARRAY['Ankles','Calves','Circulatory System'], ARRAY[4,11], ARRAY['Electric Blue','Violet'], ARRAY['Hessonite','Amethyst'],
 'The eleventh sign, ruled by Saturn. Progressive, humanitarian, and brilliantly innovative. The cosmic revolutionary.',
 ARRAY['Technology','Science','Social Reform','Astrology','Aviation','Research']),

('Meena',     'Pisces',      '♓', 'Jupiter', 'Water', 'Mutable',  'Female', 330, 360, 'Feb 19 – Mar 20',
 ARRAY['Compassionate','Dreamy','Spiritual','Artistic','Escapist'],
 ARRAY['Feet','Lymphatic System'], ARRAY[3,7], ARRAY['Sea Green','Lavender'], ARRAY['Yellow Sapphire','Aquamarine'],
 'The twelfth and final sign, ruled by Jupiter. Deeply compassionate, spiritually attuned, and boundlessly creative. The dreamer and mystic.',
 ARRAY['Medicine','Art','Music','Spirituality','Film','Healing Arts']);

-- ── Nakshatras ─────────────────────────────────────────────────
INSERT INTO nakshatras (name, symbol, ruling_planet, deity, start_degree, end_degree, description) VALUES
('Ashwini',     'Horse Head',     'Ketu',    'Ashwini Kumaras', 0,    13.2,  'Swift, pioneering nakshatra of healing and new beginnings'),
('Bharani',     'Yoni',           'Venus',   'Yama',            13.2, 26.4,  'Nakshatra of bearing responsibility and transformation'),
('Krittika',    'Flame/Razor',    'Sun',     'Agni',            26.4, 40,    'Sharp and purifying nakshatra, gives focus and determination'),
('Rohini',      'Chariot/Ox Cart','Moon',    'Brahma',          40,   53.2,  'Most fertile and creative nakshatra, governs growth and beauty'),
('Mrigashira',  'Deer Head',      'Mars',    'Soma',            53.2, 66.4,  'Gentle, searching nakshatra of curiosity and quest'),
('Ardra',       'Teardrop/Diamond','Rahu',   'Rudra',           66.4, 80,    'Stormy nakshatra of effort, struggle, and transformation'),
('Punarvasu',   'Quiver of Arrows','Jupiter','Aditi',           80,   93.2,  'Nakshatra of restoration, return, and auspiciousness'),
('Pushya',      'Cow Udder',      'Saturn',  'Brihaspati',      93.2, 106.4, 'Most auspicious of all nakshatras — nourishment and prosperity'),
('Ashlesha',    'Coiled Serpent', 'Mercury', 'Nagas',           106.4,120,   'Mystical serpentine nakshatra of wisdom and kundalini energy'),
('Magha',       'Royal Throne',   'Ketu',    'Pitras',          120,  133.2, 'Regal nakshatra of power, honor, and ancestral blessings'),
('Purva Phalguni','Front Legs of Bed','Venus','Bhaga',          133.2,146.4, 'Nakshatra of rest, pleasure, creativity, and romantic love'),
('Uttara Phalguni','Back Legs of Bed','Sun',  'Aryaman',        146.4,160,   'Nakshatra of service, friendship, and social contracts'),
('Hasta',       'Hand',           'Moon',    'Savitar',         160,  173.2, 'Nakshatra of skill, dexterity, and clever handiwork'),
('Chitra',      'Bright Jewel',   'Mars',    'Vishwakarma',     173.2,186.4, 'Brilliant nakshatra of artistic creation and perfection'),
('Swati',       'Coral/Sword',    'Rahu',    'Vayu',            186.4,200,   'Independent nakshatra of movement, trade, and flexibility'),
('Vishakha',    'Triumphal Arch', 'Jupiter', 'Indra-Agni',      200,  213.2, 'Nakshatra of goals, achievement, and purposeful ambition'),
('Anuradha',    'Lotus',          'Saturn',  'Mitra',           213.2,226.4, 'Nakshatra of devotion, friendship, and occult powers'),
('Jyeshtha',    'Circular Amulet','Mercury', 'Indra',           226.4,240,   'Eldest nakshatra of courage, seniority, and protectiveness'),
('Mula',        'Roots/Tied Bundle','Ketu',  'Nirrti',          240,  253.2, 'Destructive-creative nakshatra of investigation and roots'),
('Purva Ashadha','Elephant Tusk', 'Venus',   'Apas',            253.2,266.4, 'Invincible nakshatra of purification and declaration'),
('Uttara Ashadha','Elephant Tusk','Sun',     'Vishvadevas',     266.4,280,   'Universal nakshatra of final victory and lasting success'),
('Shravana',    'Three Footprints','Moon',   'Vishnu',          280,  293.2, 'Hearing nakshatra of learning, listening, and connection'),
('Dhanishtha',  'Drum/Flute',     'Mars',    'Eight Vasus',     293.2,306.4, 'Wealthy nakshatra of abundance and musical talent'),
('Shatabhisha', '100 Stars/Circle','Rahu',  'Varuna',          306.4,320,   'Healing nakshatra of the 100 physicians — secretive and vast'),
('Purva Bhadrapada','Front of Funeral Cot','Jupiter','Aja Ekapad',320,333.2,'Fierce spiritual nakshatra of transformation and asceticism'),
('Uttara Bhadrapada','Back of Funeral Cot','Saturn','Ahir Budhnya',333.2,346.4,'Deep-sea nakshatra of depths, wisdom, and serpentine power'),
('Revati',      'Fish/Drum',      'Mercury', 'Pushan',          346.4,360,   'Final nakshatra of completion, journeys end, and moksha');

-- ── Remedies ───────────────────────────────────────────────────
INSERT INTO remedies (planet, category, title, description, mantra, gemstone, day, color, duration, difficulty) VALUES
('Sun',     'mantra',   'Surya Beej Mantra',        'Chant the seed mantra of Sun to strengthen solar energy and gain confidence, leadership, and authority.',    'Om Hraam Hreem Hraum Sah Suryaya Namah', 'Ruby',           'Sunday',    'Red',    '108 times daily at sunrise', 'easy'),
('Sun',     'gemstone', 'Ruby (Manikya)',            'Wearing a natural ruby (minimum 3 carats) in gold on the ring finger of the right hand strengthens Sun.',    NULL,                                         'Ruby',           'Sunday',    'Red',    'Wear continuously', 'easy'),
('Moon',    'fasting',  'Monday Fast (Somvar Vrat)', 'Observe fast on Mondays, consume only white foods and milk. Offer white flowers to Lord Shiva at sunset.',   'Om Shraam Shreem Shraum Sah Chandraya Namah','Pearl',          'Monday',    'White',  'Every Monday', 'medium'),
('Moon',    'gemstone', 'Pearl (Moti)',              'Wearing natural pearl in silver on the little finger of the right hand enhances Moon''s positive qualities.', NULL,                                         'Pearl',          'Monday',    'White',  'Wear continuously', 'easy'),
('Mars',    'puja',     'Hanuman Puja',              'Worship Lord Hanuman on Tuesdays with red flowers, sindoor, and sesame oil lamp. Recite Hanuman Chalisa.',    'Om Kraam Kreem Kraum Sah Bhauma Namah',      'Red Coral',      'Tuesday',   'Red',    'Every Tuesday', 'medium'),
('Mercury', 'donation', 'Mercury Donation',          'Donate green items (green cloth, emeralds, mung beans) to students on Wednesdays to strengthen Mercury.',     'Om Braam Breem Braum Sah Budhaya Namah',     'Emerald',        'Wednesday', 'Green',  'Every Wednesday', 'easy'),
('Jupiter', 'mantra',   'Guru Beej Mantra',          'Chanting Jupiter''s mantra 108 times on Thursdays attracts wisdom, prosperity, and spiritual growth.',        'Om Graam Greem Graum Sah Gurave Namah',      'Yellow Sapphire','Thursday',  'Yellow', '108 times on Thursdays', 'easy'),
('Venus',   'yantra',   'Shukra Yantra',             'Install a copper Shukra Yantra in the home on Fridays. This geometric diagram attracts love and abundance.',   'Om Draam Dreem Draum Sah Shukraya Namah',    'Diamond',        'Friday',    'White',  'Install and worship daily', 'hard'),
('Saturn',  'puja',     'Shani Puja at Temple',      'Visit Shani temple on Saturdays. Offer sesame seeds, black cloth, and mustard oil to the Shani idol.',        'Om Praam Preem Praum Sah Shanaischaraya Namah','Blue Sapphire','Saturday',  'Black',  'Every Saturday', 'medium'),
('Rahu',    'mantra',   'Rahu Beej Mantra',          'Chanting Rahu''s mantra 108 times reduces malefic effects of Rahu and brings clarity in life situations.',    'Om Bhram Bhreem Bhraum Sah Rahave Namah',    'Hessonite',      'Saturday',  'Smoky',  '108 times daily', 'medium'),
('Ketu',    'mantra',   'Ketu Beej Mantra',          'Ketu mantra enhances spiritual growth and reduces its malefic effects including accidents and confusion.',     'Om Sraam Sreem Sraum Sah Ketave Namah',      'Cat''s Eye',     'Tuesday',   'Multi',  '108 times daily', 'medium'),
(NULL,      'herb',     'Brahmi for Mental Peace',   'Brahmi (Bacopa monnieri) herb strengthens Mercury and Moon. Take with warm milk daily for mental clarity.',    NULL,                                         NULL,             NULL,        'Green',  'Daily with warm milk', 'easy'),
(NULL,      'herb',     'Ashwagandha for Vitality',  'Ashwagandha strengthens Mars energy, boosts immunity, builds strength, and reduces stress and anxiety.',      NULL,                                         NULL,             NULL,        'White',  'Daily with warm milk', 'easy'),
(NULL,      'herb',     'Shatavari for Venus',       'Shatavari nourishes Venus qualities — enhances fertility, emotional balance, and feminine energy.',            NULL,                                         NULL,             'Friday',    'White',  'Daily with milk', 'easy');

-- ── Today's Horoscopes (sample) ────────────────────────────────
INSERT INTO horoscopes (rashi_id, type, date_from, date_to, prediction, love_score, career_score, health_score, finance_score, lucky_color, lucky_number, lucky_gem, lucky_day, love_prediction, career_prediction, health_prediction) VALUES
(1, 'daily', CURRENT_DATE, CURRENT_DATE, 'Dynamic solar energies propel you forward. A leadership opportunity arises — trust your instincts and act decisively. Your natural courage creates positive momentum in all spheres.', 85, 90, 75, 80, 'Red', 9, 'Ruby', 'Tuesday', 'Passion ignites. Bold moves win hearts.', 'Initiative is rewarded. Take the lead today.', 'Physical vitality peaks. Channel energy wisely.'),
(2, 'daily', CURRENT_DATE, CURRENT_DATE, 'Venus blesses your material world with grace and beauty. Financial matters improve steadily. Resist impulse purchases — your patient approach builds lasting wealth and security.', 90, 70, 65, 88, 'Green', 6, 'Diamond', 'Friday', 'Sensual connections deepen beautifully.', 'Steady persistence yields financial rewards.', 'Overindulgence needs mindful balance today.'),
(3, 'daily', CURRENT_DATE, CURRENT_DATE, 'Mercurial energy sharpens your already razor-sharp mind. Information flows freely and conversations reveal hidden opportunities. Choose depth over scattered surface-level pursuits.', 75, 88, 70, 75, 'Yellow', 5, 'Emerald', 'Wednesday', 'Witty banter sparks romantic possibility.', 'Communication breakthroughs open new doors.', 'Nervous system needs calming breathwork.'),
(4, 'daily', CURRENT_DATE, CURRENT_DATE, 'The Moon, your celestial ruler, amplifies your emotional intelligence today. Family matters take center stage. Your intuition is a perfect compass — follow its gentle guidance without hesitation.', 92, 65, 80, 70, 'Silver', 2, 'Pearl', 'Monday', 'Deep vulnerability creates profound intimacy.', 'Empathy makes you invaluable to your team.', 'Emotional health equals physical wellbeing.'),
(5, 'daily', CURRENT_DATE, CURRENT_DATE, 'The royal Sun blazes with confidence and charisma through your chart. Recognition arrives — step forward and claim your deserved spotlight. Generosity attracts more abundance than selfishness.', 88, 95, 85, 82, 'Gold', 1, 'Ruby', 'Sunday', 'Your magnetism is utterly irresistible today.', 'Creative leadership earns genuine admiration.', 'Exceptional vitality. Outdoor activity recharges.'),
(6, 'daily', CURRENT_DATE, CURRENT_DATE, 'Analytical Mercury gifts you precision and healing clarity. Details others overlook become your competitive advantage. Service-oriented work flourishes. Avoid over-criticism of self and others.', 65, 85, 78, 80, 'Navy', 5, 'Emerald', 'Wednesday', 'Small thoughtful gestures create lasting bonds.', 'Meticulous work yields exceptional results.', 'Digestive system benefits from clean eating.'),
(7, 'daily', CURRENT_DATE, CURRENT_DATE, 'Venus, your divine ruler, weaves harmony through all interactions. Balance is the sacred theme today. An important partnership decision becomes clear through calm, centered reflection.', 95, 80, 72, 85, 'Pink', 6, 'Diamond', 'Friday', 'Romance flourishes under Venus''s gracious light.', 'Diplomatic skills shine in negotiations.', 'Kidneys and back need gentle attention today.'),
(8, 'daily', CURRENT_DATE, CURRENT_DATE, 'Powerful transformative energies stir deep change within you. What was hidden now emerges into light. Embrace change rather than resisting it. Your greatest power lies in regeneration and rebirth.', 80, 82, 70, 78, 'Maroon', 8, 'Red Coral', 'Tuesday', 'Soul-deep connections create unbreakable bonds.', 'Research and strategy yield major breakthroughs.', 'Detoxification heals from deep within.'),
(9, 'daily', CURRENT_DATE, CURRENT_DATE, 'Expansive Jupiter, your wise guru, opens new horizons on the horizon. Adventure, philosophy, and higher wisdom call. A foreign connection or long-distance opportunity presents remarkable possibilities.', 78, 88, 82, 85, 'Purple', 3, 'Yellow Sapphire', 'Thursday', 'Shared ideals create profound romantic connection.', 'International and educational ventures flourish.', 'Active outdoor pursuits restore adventurous spirit.'),
(10,'daily', CURRENT_DATE, CURRENT_DATE, 'Disciplined Saturn rewards your patient perseverance today. Recognition for sustained effort arrives at last. Build steadily and surely — your unshakeable foundation inspires confidence in others.', 70, 92, 75, 88, 'Blue', 8, 'Blue Sapphire', 'Saturday', 'Commitment and reliability are deeply treasured.', 'Career advancement through disciplined diligence.', 'Bones and joints need care and attention.'),
(11,'daily', CURRENT_DATE, CURRENT_DATE, 'Visionary Uranus channels revolutionary ideas through your brilliant mind. Humanitarian causes and group efforts are powerfully energized. Your unique perspective is your greatest gift — do not conform.', 75, 90, 68, 80, 'Violet', 4, 'Amethyst', 'Saturday', 'Unconventional connections spark authentic love.', 'Technology and innovation bring breakthroughs.', 'Nervous system benefits from digital detox.'),
(12,'daily', CURRENT_DATE, CURRENT_DATE, 'Neptune, your mystical ruler, weaves spiritual magic through your day. Dreams carry divine messages — record them. Creative and intuitive gifts are fully amplified. Compassion heals both giver and receiver.', 92, 72, 80, 70, 'Aqua', 7, 'Yellow Sapphire', 'Thursday', 'Soulmate energy surrounds you beautifully.', 'Art, healing, and spiritual work flow with ease.', 'Meditation and water therapy restore harmony.');

-- ── Current Planetary Transits ─────────────────────────────────
INSERT INTO planetary_transits (planet, to_sign, transit_date, end_date, is_retrograde, degree_position, effects) VALUES
('Sun',     'Aquarius', '2026-01-20', '2026-02-18', FALSE, 15.3, 'Focus on community, humanitarian ideals, and innovative thinking. Authority derives from original ideas.'),
('Moon',    'Scorpio',  CURRENT_DATE, CURRENT_DATE + 2, FALSE, 22.7, 'Deep emotional undercurrents. Excellent for meditation, healing work, and accessing hidden wisdom.'),
('Mars',    'Gemini',   '2026-01-06', '2026-02-28', FALSE, 18.4, 'Mental energy elevated. Favorable for debates, negotiations, learning, and quick strategic decisions.'),
('Mercury', 'Aquarius', '2026-01-27', '2026-02-14', FALSE, 8.1,  'Brilliant, innovative ideas flow freely. Technology, science, and unconventional communication flourish.'),
('Jupiter', 'Taurus',   '2025-05-01', '2026-05-14', FALSE, 12.9, 'Steady material abundance. Wealth accumulation through patient, methodical effort. Enjoy earthly pleasures.'),
('Venus',   'Pisces',   '2026-02-01', '2026-02-25', FALSE, 14.5, 'Romantic and spiritual peak. Art, compassion, and unconditional love are magnificently highlighted.'),
('Saturn',  'Pisces',   '2023-03-07', '2025-05-24', FALSE, 19.2, 'Karmic lessons around spiritual boundaries and creativity. Discipline in imaginative endeavors.'),
('Rahu',    'Pisces',   '2025-10-18', '2027-04-29', FALSE, 4.6,  'Karmic pull toward spirituality, foreign journeys, and transcendence. Watch for illusions and self-deception.');
