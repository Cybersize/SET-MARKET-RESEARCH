export interface StaticCompany {
  symbol: string;
  nameEn: string;
  market: 'SET' | 'mai';
  industry: string;
  sector: string;
}

// SET-listed companies — seed list for sync.
// Source: SET website public information (set.or.th)
// Last verified: 2025. Update when new companies are listed/delisted.
export const SET_COMPANIES: StaticCompany[] = [
  // ── Agro & Food Industry ─────────────────────────────────────────────────
  // Agribusiness
  { symbol: 'CPF',    nameEn: 'Charoen Pokphand Foods',           market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'TFG',    nameEn: 'Thai Foods Group',                  market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'GFPT',   nameEn: 'GFPT',                              market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'BR',     nameEn: 'Bangkok Ranch',                     market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'CFRESH', nameEn: 'Charoen Pokphand Foods (Fresh)',    market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'CHEWA',  nameEn: 'Chewa Life Assurance',             market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'STA',    nameEn: 'Sri Trang Agro-Industry',           market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'KASET',  nameEn: 'Kaset Thai International Sugar',   market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'KSL',    nameEn: 'Khon Kaen Sugar Industry',          market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'LST',    nameEn: 'Lifestar',                          market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'KTIS',   nameEn: 'Khon Kaen Sugar Industry (KTIS)',  market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'PRG',    nameEn: 'Praram 9 Hospital',                 market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'SFAN',   nameEn: 'Siam Fandicap',                     market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'TAPAC',  nameEn: 'Thai Agricultural Products',        market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'TPC',    nameEn: 'Thai Plastic Compounds',            market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'UVAN',   nameEn: 'Univanich Palm Oil',                market: 'SET', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  // Food & Beverage
  { symbol: 'TU',     nameEn: 'Thai Union Group',                  market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'MINT',   nameEn: 'Minor International',               market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'OISHI',  nameEn: 'Oishi Group',                       market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'CBG',    nameEn: 'Carabao Group',                     market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'SAPPE',  nameEn: 'Sappe',                             market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'OSP',    nameEn: 'Osotspa',                           market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'TBK',    nameEn: 'Thai Beverage',                     market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'ICHI',   nameEn: 'Ichitan Group',                     market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'NRF',    nameEn: 'Nara Restaurant Business',          market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'SFP',    nameEn: 'Sea Fresh Products',                market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'ZEN',    nameEn: 'ZEN Corporation Group',             market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'COCOCO', nameEn: 'Chiang Mai Frozen Foods',           market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'DOHOME', nameEn: 'Do Home',                           market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'MEGA',   nameEn: 'Mega Lifesciences',                 market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'PB',     nameEn: 'PB International',                  market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'PTTEP',  nameEn: 'PTT Exploration & Production',      market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'SNP',    nameEn: 'S&P Syndicate',                     market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'SORKON', nameEn: 'Sorkon Group',                      market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'TIPCO',  nameEn: 'TIPCO Asphalt',                     market: 'SET', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },

  // ── Consumer Products ────────────────────────────────────────────────────
  // Fashion
  { symbol: 'MC',     nameEn: 'MC Group',                          market: 'SET', industry: 'Consumer Products', sector: 'Fashion' },
  { symbol: 'PRANDA', nameEn: 'Pranda Jewelry',                    market: 'SET', industry: 'Consumer Products', sector: 'Fashion' },
  { symbol: 'SABINA', nameEn: 'Sabina',                            market: 'SET', industry: 'Consumer Products', sector: 'Fashion' },
  { symbol: 'BAFS',   nameEn: 'Bangkok Aviation Fuel Services',    market: 'SET', industry: 'Consumer Products', sector: 'Fashion' },
  { symbol: 'NKI',    nameEn: 'Nam Kee Industrial',               market: 'SET', industry: 'Consumer Products', sector: 'Fashion' },
  { symbol: 'IHL',    nameEn: 'Indara Insurance',                  market: 'SET', industry: 'Consumer Products', sector: 'Fashion' },
  // Home & Office Products
  { symbol: 'HMPRO',  nameEn: 'Home Product Center',               market: 'SET', industry: 'Consumer Products', sector: 'Home & Office Products' },
  { symbol: 'GLOBAL', nameEn: 'Siam Global House',                 market: 'SET', industry: 'Consumer Products', sector: 'Home & Office Products' },
  { symbol: 'DCC',    nameEn: 'Dusit Couture',                     market: 'SET', industry: 'Consumer Products', sector: 'Home & Office Products' },
  { symbol: 'TNP',    nameEn: 'Thai NICHI Industries',             market: 'SET', industry: 'Consumer Products', sector: 'Home & Office Products' },
  // Personal Products & Pharma
  { symbol: 'DTAC',   nameEn: 'Total Access Communication',        market: 'SET', industry: 'Consumer Products', sector: 'Personal Products & Pharma' },
  { symbol: 'BEAUTY', nameEn: 'Beauty Community',                  market: 'SET', industry: 'Consumer Products', sector: 'Personal Products & Pharma' },
  { symbol: 'MASTER', nameEn: 'Master Ad',                         market: 'SET', industry: 'Consumer Products', sector: 'Personal Products & Pharma' },
  { symbol: 'TKN',    nameEn: 'Takano (Thailand)',                 market: 'SET', industry: 'Consumer Products', sector: 'Personal Products & Pharma' },
  // Commerce
  { symbol: 'CPALL',  nameEn: 'CP ALL',                            market: 'SET', industry: 'Consumer Products', sector: 'Commerce' },
  { symbol: 'MAKRO',  nameEn: 'Siam Makro',                        market: 'SET', industry: 'Consumer Products', sector: 'Commerce' },
  { symbol: 'BJC',    nameEn: 'Berli Jucker',                      market: 'SET', industry: 'Consumer Products', sector: 'Commerce' },
  { symbol: 'COM7',   nameEn: 'COM7',                              market: 'SET', industry: 'Consumer Products', sector: 'Commerce' },
  { symbol: 'JMT',    nameEn: 'JMT Network Services',              market: 'SET', industry: 'Consumer Products', sector: 'Commerce' },
  { symbol: 'JMART',  nameEn: 'Jay Mart',                          market: 'SET', industry: 'Consumer Products', sector: 'Commerce' },
  { symbol: 'SINGER', nameEn: 'Singer Thailand',                   market: 'SET', industry: 'Consumer Products', sector: 'Commerce' },
  { symbol: 'SPVI',   nameEn: 'Siam Panich Leasing',               market: 'SET', industry: 'Consumer Products', sector: 'Commerce' },

  // ── Financials ───────────────────────────────────────────────────────────
  // Banking
  { symbol: 'BBL',    nameEn: 'Bangkok Bank',                      market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'KBANK',  nameEn: 'Kasikornbank',                      market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'KTB',    nameEn: 'Krungthai Bank',                    market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'SCB',    nameEn: 'Siam Commercial Bank',              market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'BAY',    nameEn: 'Bank of Ayudhya',                   market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'TMB',    nameEn: 'TMBThanachart Bank',                market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'TTB',    nameEn: 'TMBThanachart Bank',                market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'TISCO',  nameEn: 'TISCO Financial Group',             market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'KKP',    nameEn: 'Kiatnakin Phatra Bank',             market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'CIMBT',  nameEn: 'CIMB Thai Bank',                    market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'LHFG',   nameEn: 'LH Financial Group',                market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'TCAP',   nameEn: 'Thanachart Capital',                market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'UOBT',   nameEn: 'United Overseas Bank (Thai)',       market: 'SET', industry: 'Financials', sector: 'Banking' },
  { symbol: 'SCBT',   nameEn: 'Standard Chartered Bank (Thai)',    market: 'SET', industry: 'Financials', sector: 'Banking' },
  // Finance & Securities
  { symbol: 'TIDLOR', nameEn: 'Ngern Tid Lor',                     market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'MTC',    nameEn: 'Muangthai Capital',                 market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'SAWAD',  nameEn: 'Srisawad Corporation',              market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'AEONTS', nameEn: 'AEON Thana Sinsap (Thailand)',      market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'ASK',    nameEn: 'Asia Sermkij Leasing',              market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'CHAYO',  nameEn: 'Chayo Group',                       market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'GL',     nameEn: 'Group Lease',                        market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'GULF',   nameEn: 'Gulf Energy Development',           market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'HANA',   nameEn: 'Hana Microelectronics',             market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'KTC',    nameEn: 'Krungthai Card',                    market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'MBKET',  nameEn: 'MBK Entertainment',                 market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'MFEC',   nameEn: 'MFEC',                              market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'PHOL',   nameEn: 'Phol Dhanya',                       market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'SAK',    nameEn: 'Siam Asset Capital',                market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'THREL',  nameEn: 'Thaire Life Assurance',             market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'GCAP',   nameEn: 'Group Capital',                     market: 'SET', industry: 'Financials', sector: 'Finance & Securities' },
  // Insurance
  { symbol: 'BKI',    nameEn: 'Bangkok Insurance',                 market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'THRE',   nameEn: 'Thai Reinsurance',                  market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'TQM',    nameEn: 'TQM Corporation',                   market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'OIC',    nameEn: 'OIC Insurance',                     market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'ERGO',   nameEn: 'ERGO Insurance',                    market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'MUANG',  nameEn: 'Muang Thai Insurance',              market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'NUI',    nameEn: 'Navy Insurance',                    market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'SMK',    nameEn: 'Sammakorn',                         market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'THAI',   nameEn: 'Thai Airways International',        market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'TIP',    nameEn: 'Thai Indemnity Insurance',          market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'TIPH',   nameEn: 'Thai Insurance',                    market: 'SET', industry: 'Financials', sector: 'Insurance' },
  { symbol: 'VIBE',   nameEn: 'Vibha Medical Center',              market: 'SET', industry: 'Financials', sector: 'Insurance' },

  // ── Industrials ──────────────────────────────────────────────────────────
  // Automotive
  { symbol: 'AH',     nameEn: 'Aapico Hitech',                     market: 'SET', industry: 'Industrials', sector: 'Automotive' },
  { symbol: 'SAT',    nameEn: 'Somboon Advance Technology',        market: 'SET', industry: 'Industrials', sector: 'Automotive' },
  { symbol: 'STANLY', nameEn: 'Stanley',                           market: 'SET', industry: 'Industrials', sector: 'Automotive' },
  { symbol: 'THAI',   nameEn: 'Thai Rung Union Car',               market: 'SET', industry: 'Industrials', sector: 'Automotive' },
  { symbol: 'TRUBB',  nameEn: 'Thai Rubber Latex Corporation',     market: 'SET', industry: 'Industrials', sector: 'Automotive' },
  { symbol: 'TRU',    nameEn: 'Thai Rubber Latex',                 market: 'SET', industry: 'Industrials', sector: 'Automotive' },
  // Industrial Materials & Machinery
  { symbol: 'IRPC',   nameEn: 'IRPC',                              market: 'SET', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'PTTGC',  nameEn: 'PTT Global Chemical',               market: 'SET', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'SCC',    nameEn: 'Siam Cement Group',                 market: 'SET', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'SCCC',   nameEn: 'Siam City Cement',                  market: 'SET', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'TPI',    nameEn: 'TPI Polene',                        market: 'SET', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'TPIPL',  nameEn: 'TPI Polene Power',                  market: 'SET', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'BWG',    nameEn: 'Better World Green',                market: 'SET', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'GJS',    nameEn: 'Gunkul Engineering',                market: 'SET', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'GUNKUL', nameEn: 'Gunkul Engineering',                market: 'SET', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  // Petrochemicals & Chemicals
  { symbol: 'TOP',    nameEn: 'Thai Oil',                          market: 'SET', industry: 'Industrials', sector: 'Petrochemicals & Chemicals' },
  { symbol: 'SPRC',   nameEn: 'Star Petroleum Refining',           market: 'SET', industry: 'Industrials', sector: 'Petrochemicals & Chemicals' },
  { symbol: 'BCP',    nameEn: 'Bangchak Corporation',              market: 'SET', industry: 'Industrials', sector: 'Petrochemicals & Chemicals' },
  { symbol: 'ESSO',   nameEn: 'Esso Thailand',                     market: 'SET', industry: 'Industrials', sector: 'Petrochemicals & Chemicals' },
  { symbol: 'IVL',    nameEn: 'Indorama Ventures',                 market: 'SET', industry: 'Industrials', sector: 'Petrochemicals & Chemicals' },
  { symbol: 'TPCORP', nameEn: 'TP Corporation',                    market: 'SET', industry: 'Industrials', sector: 'Petrochemicals & Chemicals' },
  { symbol: 'TPOLY',  nameEn: 'Thai Polycons',                     market: 'SET', industry: 'Industrials', sector: 'Petrochemicals & Chemicals' },
  // Steel
  { symbol: 'MILL',   nameEn: 'Millcon Steel',                     market: 'SET', industry: 'Industrials', sector: 'Steel' },
  { symbol: 'TSTH',   nameEn: 'Tata Steel Thailand',               market: 'SET', industry: 'Industrials', sector: 'Steel' },
  { symbol: 'SSI',    nameEn: 'Sahaviriya Steel Industries',       market: 'SET', industry: 'Industrials', sector: 'Steel' },

  // ── Property & Construction ──────────────────────────────────────────────
  // Construction Materials
  { symbol: 'CMAN',   nameEn: 'Ceramic Manufacturing & Supply',   market: 'SET', industry: 'Property & Construction', sector: 'Construction Materials' },
  { symbol: 'TASCO',  nameEn: 'Tipco Asphalt',                    market: 'SET', industry: 'Property & Construction', sector: 'Construction Materials' },
  { symbol: 'Q-CON',  nameEn: 'Q-CON',                            market: 'SET', industry: 'Property & Construction', sector: 'Construction Materials' },
  // Construction Services
  { symbol: 'CK',     nameEn: 'Ch. Karnchang',                    market: 'SET', industry: 'Property & Construction', sector: 'Construction Services' },
  { symbol: 'ITD',    nameEn: 'Italian-Thai Development',          market: 'SET', industry: 'Property & Construction', sector: 'Construction Services' },
  { symbol: 'STEC',   nameEn: 'Sino-Thai Engineering & Construction', market: 'SET', industry: 'Property & Construction', sector: 'Construction Services' },
  { symbol: 'PYLON',  nameEn: 'Pylon',                            market: 'SET', industry: 'Property & Construction', sector: 'Construction Services' },
  { symbol: 'NWR',    nameEn: 'Nawarat Patanakarn',               market: 'SET', industry: 'Property & Construction', sector: 'Construction Services' },
  { symbol: 'SEAFCO', nameEn: 'Seafco',                            market: 'SET', industry: 'Property & Construction', sector: 'Construction Services' },
  { symbol: 'UNIQ',   nameEn: 'Unique Engineering and Construction', market: 'SET', industry: 'Property & Construction', sector: 'Construction Services' },
  // Property Development
  { symbol: 'CPN',    nameEn: 'Central Pattana',                  market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'LPN',    nameEn: 'LPN Development',                  market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'AP',     nameEn: 'AP (Thailand)',                     market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'SIRI',   nameEn: 'Sansiri',                          market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'SPALI',  nameEn: 'Supalai',                          market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'LH',     nameEn: 'Land and Houses',                  market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'PSH',    nameEn: 'Prinsiri',                         market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'ORIGIN', nameEn: 'Origin Property',                  market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'SC',     nameEn: 'SC Asset Corporation',             market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'ORI',    nameEn: 'Origin Property',                  market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'NOBLE',  nameEn: 'Noble Development',                market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'LALIN',  nameEn: 'Lalin Property',                   market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'PF',     nameEn: 'Property Fund',                    market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'QH',     nameEn: 'Quality Houses',                   market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'RCL',    nameEn: 'Regional Container Lines',         market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'RICHY',  nameEn: 'Richy Place 2002',                 market: 'SET', industry: 'Property & Construction', sector: 'Property Development' },
  // Real Estate Investment & Services
  { symbol: 'WHA',    nameEn: 'WHA Corporation',                  market: 'SET', industry: 'Property & Construction', sector: 'Real Estate Investment & Services' },
  { symbol: 'FTREIT', nameEn: 'Frasers Property Thailand Industrial REIT', market: 'SET', industry: 'Property & Construction', sector: 'Real Estate Investment & Services' },

  // ── Resources ────────────────────────────────────────────────────────────
  // Energy & Utilities
  { symbol: 'PTT',    nameEn: 'PTT',                              market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'PTTEP',  nameEn: 'PTT Exploration and Production',   market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'EGCO',   nameEn: 'Electricity Generating',           market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'GPSC',   nameEn: 'Global Power Synergy',             market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'RATCH',  nameEn: 'Ratchaburi Electricity Generating Holding', market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'EA',     nameEn: 'Energy Absolute',                  market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'BCPG',   nameEn: 'BCPG',                             market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'CKP',    nameEn: 'CK Power',                         market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'SPCG',   nameEn: 'SPCG',                             market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'GLOW',   nameEn: 'Glow Energy',                      market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'BGRIM',  nameEn: 'B.Grimm Power',                    market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'SUPER',  nameEn: 'Super Energy Corporation',         market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'PPP',    nameEn: 'PTT Phenol',                       market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'BANPU',  nameEn: 'Banpu',                            market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'BPP',    nameEn: 'Banpu Power',                      market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'INOX',   nameEn: 'Inox Air Products',                market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'DEMCO',  nameEn: 'DEMCO',                            market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'TPCH',   nameEn: 'TPC Power Holding',                market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'WHAUP',  nameEn: 'WHA Utilities and Power',          market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  { symbol: 'GULF',   nameEn: 'Gulf Energy Development',          market: 'SET', industry: 'Resources', sector: 'Energy & Utilities' },
  // Mining
  { symbol: 'THL',    nameEn: 'Thoresen Thai Agencies',           market: 'SET', industry: 'Resources', sector: 'Mining' },
  { symbol: 'GOLD',   nameEn: 'Khon Kaen Sugar (Gold)',           market: 'SET', industry: 'Resources', sector: 'Mining' },

  // ── Services ─────────────────────────────────────────────────────────────
  // Commerce
  { symbol: 'ROBINS', nameEn: 'Robinson Department Store',        market: 'SET', industry: 'Services', sector: 'Commerce' },
  { symbol: 'CRC',    nameEn: 'Central Retail Corporation',       market: 'SET', industry: 'Services', sector: 'Commerce' },
  { symbol: 'CRG',    nameEn: 'Central Restaurant Group',         market: 'SET', industry: 'Services', sector: 'Commerce' },
  // Entertainment & Recreation
  { symbol: 'MBK',    nameEn: 'MBK',                              market: 'SET', industry: 'Services', sector: 'Entertainment & Recreation' },
  { symbol: 'MAJOR',  nameEn: 'Major Cineplex Group',             market: 'SET', industry: 'Services', sector: 'Entertainment & Recreation' },
  { symbol: 'SF',     nameEn: 'SF Corporation',                   market: 'SET', industry: 'Services', sector: 'Entertainment & Recreation' },
  { symbol: 'RS',     nameEn: 'RS',                               market: 'SET', industry: 'Services', sector: 'Entertainment & Recreation' },
  { symbol: 'GRAMMY', nameEn: 'GMM Grammy',                       market: 'SET', industry: 'Services', sector: 'Entertainment & Recreation' },
  { symbol: 'WORK',   nameEn: 'Workpoint Entertainment',          market: 'SET', industry: 'Services', sector: 'Entertainment & Recreation' },
  // Health Care Services
  { symbol: 'BDMS',   nameEn: 'Bangkok Dusit Medical Services',   market: 'SET', industry: 'Services', sector: 'Health Care Services' },
  { symbol: 'BH',     nameEn: 'Bumrungrad Hospital',              market: 'SET', industry: 'Services', sector: 'Health Care Services' },
  { symbol: 'CHG',    nameEn: 'Chularat Hospital Group',          market: 'SET', industry: 'Services', sector: 'Health Care Services' },
  { symbol: 'VIBHA',  nameEn: 'Vibhavadi Medical Center',         market: 'SET', industry: 'Services', sector: 'Health Care Services' },
  { symbol: 'NTV',    nameEn: 'N Health',                         market: 'SET', industry: 'Services', sector: 'Health Care Services' },
  { symbol: 'BCH',    nameEn: 'Bangkok Chain Hospital',           market: 'SET', industry: 'Services', sector: 'Health Care Services' },
  { symbol: 'PRINC',  nameEn: 'Principal Capital',                market: 'SET', industry: 'Services', sector: 'Health Care Services' },
  { symbol: 'SAM',    nameEn: 'Samart Corporation',               market: 'SET', industry: 'Services', sector: 'Health Care Services' },
  { symbol: 'THCOM',  nameEn: 'Thaicom',                          market: 'SET', industry: 'Services', sector: 'Health Care Services' },
  // Hotel & Travel Services
  { symbol: 'ERW',    nameEn: 'The Erawan Group',                 market: 'SET', industry: 'Services', sector: 'Hotel & Travel Services' },
  { symbol: 'CENTEL', nameEn: 'Central Plaza Hotel',              market: 'SET', industry: 'Services', sector: 'Hotel & Travel Services' },
  { symbol: 'DUSIT',  nameEn: 'Dusit International',             market: 'SET', industry: 'Services', sector: 'Hotel & Travel Services' },
  { symbol: 'SHR',    nameEn: 'S Hotels and Resorts',            market: 'SET', industry: 'Services', sector: 'Hotel & Travel Services' },
  { symbol: 'MANRIN', nameEn: 'Manrin Hotel',                    market: 'SET', industry: 'Services', sector: 'Hotel & Travel Services' },
  // Media & Publishing
  { symbol: 'BEC',    nameEn: 'BEC World',                       market: 'SET', industry: 'Services', sector: 'Media & Publishing' },
  { symbol: 'MCOT',   nameEn: 'MCOT',                            market: 'SET', industry: 'Services', sector: 'Media & Publishing' },
  { symbol: 'MONO',   nameEn: 'Mono Technology',                 market: 'SET', industry: 'Services', sector: 'Media & Publishing' },
  { symbol: 'VGI',    nameEn: 'VGI',                             market: 'SET', industry: 'Services', sector: 'Media & Publishing' },
  { symbol: 'PLAN',   nameEn: 'Plan B Media',                    market: 'SET', industry: 'Services', sector: 'Media & Publishing' },
  { symbol: 'MACO',   nameEn: 'Master Ad',                       market: 'SET', industry: 'Services', sector: 'Media & Publishing' },
  // Transportation & Logistics
  { symbol: 'AOT',    nameEn: 'Airports of Thailand',            market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'AAV',    nameEn: 'Asia Aviation',                   market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'BA',     nameEn: 'Bangkok Airways',                 market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'NOK',    nameEn: 'Nok Airlines',                    market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'BTS',    nameEn: 'BTS Group Holdings',              market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'BEM',    nameEn: 'Bangkok Expressway and Metro',    market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'TOLL',   nameEn: 'Toll (Thailand)',                 market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'RCL',    nameEn: 'Regional Container Lines',        market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'TTA',    nameEn: 'Thoresen Thai Agencies',          market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'PSL',    nameEn: 'Precious Shipping',               market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'WICE',   nameEn: 'Wice Logistics',                  market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'LEO',    nameEn: 'Leo Global Logistics',            market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'KERRY',  nameEn: 'Kerry Express (Thailand)',        market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'INDY',   nameEn: 'Indy Sport',                     market: 'SET', industry: 'Services', sector: 'Transportation & Logistics' },

  // ── Technology ───────────────────────────────────────────────────────────
  // Electronic Components
  { symbol: 'HANA',   nameEn: 'Hana Microelectronics',           market: 'SET', industry: 'Technology', sector: 'Electronic Components' },
  { symbol: 'DELTA',  nameEn: 'Delta Electronics (Thailand)',    market: 'SET', industry: 'Technology', sector: 'Electronic Components' },
  { symbol: 'KCE',    nameEn: 'KCE Electronics',                 market: 'SET', industry: 'Technology', sector: 'Electronic Components' },
  { symbol: 'SVI',    nameEn: 'SVI',                             market: 'SET', industry: 'Technology', sector: 'Electronic Components' },
  { symbol: 'CCET',   nameEn: 'Cal-Comp Electronics (Thailand)', market: 'SET', industry: 'Technology', sector: 'Electronic Components' },
  // IT & Software
  { symbol: 'MFEC',   nameEn: 'MFEC',                            market: 'SET', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'NETBAY', nameEn: 'Netbay',                          market: 'SET', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'BBIK',   nameEn: 'Bitkub Online',                   market: 'SET', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'INET',   nameEn: 'Internet Thailand',               market: 'SET', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'CYBXT',  nameEn: 'CYBXT',                           market: 'SET', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'DIF',    nameEn: 'Digital Infrastructure Fund',     market: 'SET', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'GIT',    nameEn: 'Gemological Institute of Asia',   market: 'SET', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'HUMAN',  nameEn: 'Human Interface',                 market: 'SET', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'NUSA',   nameEn: 'NUSA',                            market: 'SET', industry: 'Technology', sector: 'IT & Software' },
  // Telecommunications
  { symbol: 'ADVANC', nameEn: 'Advanced Info Service',           market: 'SET', industry: 'Technology', sector: 'Telecommunications' },
  { symbol: 'TRUE',   nameEn: 'True Corporation',                market: 'SET', industry: 'Technology', sector: 'Telecommunications' },
  { symbol: 'INTOUCH',nameEn: 'Intouch Holdings',                market: 'SET', industry: 'Technology', sector: 'Telecommunications' },
  { symbol: 'THCOM',  nameEn: 'Thaicom',                         market: 'SET', industry: 'Technology', sector: 'Telecommunications' },
  { symbol: 'JASIF',  nameEn: 'Jasmine Broadband Internet Infrastructure Fund', market: 'SET', industry: 'Technology', sector: 'Telecommunications' },
  { symbol: 'JAS',    nameEn: 'Jasmine International',           market: 'SET', industry: 'Technology', sector: 'Telecommunications' },

  // ── MAI ──────────────────────────────────────────────────────────────────
  { symbol: 'ASW',    nameEn: 'Asia Wealth',                     market: 'mai', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'BFIT',   nameEn: 'Bangkok First Investment & Trust', market: 'mai', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'BPVI',   nameEn: 'B.Prema Vision',                  market: 'mai', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'CITY',   nameEn: 'City Developments',               market: 'mai', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'CMR',    nameEn: 'CMR',                             market: 'mai', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'CNS',    nameEn: 'Country National Securities',     market: 'mai', industry: 'Financials', sector: 'Finance & Securities' },
  { symbol: 'EVER',   nameEn: 'Ever',                            market: 'mai', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'FORTH',  nameEn: 'Forth Corporation',               market: 'mai', industry: 'Technology', sector: 'Electronic Components' },
  { symbol: 'GEN',    nameEn: 'Generation Mining',               market: 'mai', industry: 'Resources', sector: 'Mining' },
  { symbol: 'GLAND',  nameEn: 'Grand Land',                      market: 'mai', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'ITEL',   nameEn: 'Interlink Telecom',               market: 'mai', industry: 'Technology', sector: 'Telecommunications' },
  { symbol: 'KAMART', nameEn: 'K-Art',                           market: 'mai', industry: 'Consumer Products', sector: 'Commerce' },
  { symbol: 'KWC',    nameEn: 'K.W.C.',                          market: 'mai', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'LOXLEY', nameEn: 'Loxley',                          market: 'mai', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'LRH',    nameEn: 'Lam Research Holdings',           market: 'mai', industry: 'Services', sector: 'Health Care Services' },
  { symbol: 'MBAX',   nameEn: 'MBax',                            market: 'mai', industry: 'Industrials', sector: 'Paper & Printing Materials' },
  { symbol: 'OCEAN',  nameEn: 'Ocean Glass',                     market: 'mai', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'OFM',    nameEn: 'OFM',                             market: 'mai', industry: 'Agro & Food Industry', sector: 'Food & Beverage' },
  { symbol: 'PATO',   nameEn: 'Patong Hotel',                    market: 'mai', industry: 'Services', sector: 'Hotel & Travel Services' },
  { symbol: 'PERM',   nameEn: 'Permanent Solution Industry',     market: 'mai', industry: 'Industrials', sector: 'Industrial Materials & Machinery' },
  { symbol: 'PM',     nameEn: 'Premier Marketing',               market: 'mai', industry: 'Consumer Products', sector: 'Commerce' },
  { symbol: 'ROCK',   nameEn: 'Rock',                            market: 'mai', industry: 'Consumer Products', sector: 'Fashion' },
  { symbol: 'SAVE',   nameEn: 'Save Express',                    market: 'mai', industry: 'Services', sector: 'Transportation & Logistics' },
  { symbol: 'SKY',    nameEn: 'Sky ICT',                         market: 'mai', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'STGT',   nameEn: 'Sri Trang Gloves Thailand',       market: 'mai', industry: 'Agro & Food Industry', sector: 'Agribusiness' },
  { symbol: 'STP',    nameEn: 'Sahapat Trading',                 market: 'mai', industry: 'Consumer Products', sector: 'Commerce' },
  { symbol: 'TPAC',   nameEn: 'Thai Packaging and Accessories',  market: 'mai', industry: 'Industrials', sector: 'Paper & Printing Materials' },
  { symbol: 'TWP',    nameEn: 'TWP',                             market: 'mai', industry: 'Property & Construction', sector: 'Property Development' },
  { symbol: 'UCOUNT', nameEn: 'UniCount',                        market: 'mai', industry: 'Technology', sector: 'IT & Software' },
  { symbol: 'WIN',    nameEn: 'WIN Enterprise',                  market: 'mai', industry: 'Technology', sector: 'IT & Software' },
];

// Deduplicate by symbol (keep last occurrence)
const seen = new Set<string>();
const deduped: StaticCompany[] = [];
for (let i = SET_COMPANIES.length - 1; i >= 0; i--) {
  const c = SET_COMPANIES[i];
  if (!seen.has(c.symbol)) {
    seen.add(c.symbol);
    deduped.unshift(c);
  }
}
export const COMPANIES = deduped;
