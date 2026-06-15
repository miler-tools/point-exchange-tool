/* ============================================================
 * card-rates.js
 * ------------------------------------------------------------
 * マイラー向けクレジットカード「基本還元率」共有データソース
 *
 * 【利用ツール】
 *  - mile-card-tool.html（マイル最強クレカ診断ツール／19枚比較）
 *  - （今後）シーン別ポイント獲得率表
 *
 * 【このファイルの役割】
 *  各カードの基本還元率（汎用決済・マイル換算後の実質%）に関する
 *  「単一の正データ」です。公式サイト照合による数値監査を行う際は、
 *  このファイルだけを更新すれば、両ツールに反映できます。
 *
 * 【フィールドの意味】
 *  id          : カードの一意な識別子（mile-card-tool.htmlのCARDS[].idと一致）
 *  name        : カード名
 *  issuer      : 発行会社・国際ブランド提携先
 *  brands      : 申込可能な国際ブランド
 *  fee         : 年会費（円・税込目安）
 *  feeNote     : 還元率や年会費に関する補足条件
 *  pointSystem : このカードの基本ポイントが帰属するポイント経済圏/通貨
 *                （シーン別獲得率表で「どの経済圏の上乗せ条件が
 *                 このカードに乗るか」を判定するための新規フィールド）
 *  psType      : 'psite'   = ポイントサイト経由の申込が有利な傾向
 *                'referral'= 紹介リンク経由の申込が有利な傾向
 *  rates       : 汎用決済時・マイル換算後の実質還元率（%）
 *                { ANA, JAL, KF（KrisFlyer）, MB（マリオットBonvoy）, ALL }
 *
 * 【最終監査】2026年5月7日（公式サイト照合済み・mile-card-tool.html v5準拠）
 *
 * 【注意・移行方針】
 *  現時点ではmile-card-tool.html自体はこのファイルを参照していません
 *  （既存の動作に影響を与えないための一旦の措置）。
 *  まずは新規ツール側でこのファイルを読み込んで使い始め、
 *  問題なく運用できることを確認したうえで、後日
 *  mile-card-tool.html側もこのファイル参照に切り替える、
 *  という2段階移行を想定しています。
 *
 * 【読み込み方（HTML側）】
 *   <script src="./card-rates.js"></script>
 *   <script>
 *     const card = CARD_RATES.find(c => c.id === 'rakuten-pre');
 *     console.log(card.rates.ALL); // 0.5
 *   </script>
 * ============================================================ */

// マリオットBonvoy：60,000pt単位のバッチ変換（25%ボーナス込み）
// 60,000pt → 20,000マイル + 5,000マイル(ボーナス) = 25,000マイル（換算率41.67%）
// 60,000ptに満たない端数分はボーナスなし（換算率33.33%）
function mbBatchToMiles(pt) {
  const batches = Math.floor(pt / 60000);
  const remainder = pt % 60000;
  return batches * 25000 + Math.round(remainder * (20000 / 60000));
}

const CARD_RATES = [
  {
    id: 'mb-pre',
    name: 'マリオットBonvoy アメックスプレミアム',
    issuer: 'American Express',
    brands: ['AMEX'],
    fee: 82500,
    feeNote: '2025年8月21日以降の新規入会者（旧49,500円から改定）',
    pointSystem: 'マリオットBonvoy',
    psType: 'referral',
    rates: { ANA: 1.25, JAL: 1.25, KF: 1.25, MB: 3.0, ALL: 1.25 },
  },
  {
    id: 'saison-plat',
    name: 'セゾンプラチナ ビジネスアメックス',
    issuer: 'American Express（セゾン）',
    brands: ['AMEX'],
    fee: 33000,
    feeNote: '※JAL1.125%はセゾンマイルクラブ（年5,500円）加入前提。実質年会費38,500円（カード33,000円＋マイルクラブ5,500円）。',
    pointSystem: 'JALマイル直接（セゾンマイルクラブ経由）',
    psType: 'psite',
    rates: { ANA: 0, JAL: 1.125, KF: 0, MB: 0, ALL: 1.125 },
  },
  {
    id: 'amex-gold-pref',
    name: 'アメックスゴールド・プリファード',
    issuer: 'American Express',
    brands: ['AMEX'],
    fee: 39600,
    feeNote: 'ANA移行は「MRアナコース」年5,500円別途必要（年間上限40,000マイル）。JAL移行は2,500pt→1,000マイルと低効率（0.4%）。',
    pointSystem: 'AMEXメンバーシップ・リワード',
    psType: 'referral',
    rates: { ANA: 1.0, JAL: 0.4, KF: 0.8, MB: 0, ALL: 1.0 },
  },
  {
    id: 'ana-amex-gold',
    name: 'ANAアメックスゴールドカード',
    issuer: 'American Express',
    brands: ['AMEX'],
    fee: 34100,
    feeNote: '※ポイント移行コース年6,600円込みで1.0%還元（実質40,700円）。',
    pointSystem: 'ANAマイル直接',
    psType: 'referral',
    rates: { ANA: 1.0, JAL: 0, KF: 0, MB: 0, ALL: 1.0 },
  },
  {
    id: 'sora',
    name: 'ソラチカゴールドカード',
    issuer: 'JCB（ANA To Me CARD PASMO JCB Gold）',
    brands: ['JCB'],
    fee: 11000,
    feeNote: null,
    pointSystem: 'ANAマイル直接（ANA Pay二重取り）',
    psType: 'psite',
    rates: { ANA: 1.0, JAL: 0, KF: 0, MB: 0, ALL: 1.0 },
  },
  {
    id: 'ana-wide-g',
    name: 'ANAワイドゴールドカード',
    issuer: 'JCB / VISA / Mastercard',
    brands: ['JCB', 'VISA', 'MC'],
    fee: 15400,
    feeNote: null,
    pointSystem: 'ANAマイル直接',
    psType: 'psite',
    rates: { ANA: 1.0, JAL: 0, KF: 0, MB: 0, ALL: 1.0 },
  },
  {
    id: 'mufg-plat',
    name: '三菱UFJカード・プラチナ・アメックス',
    issuer: 'American Express（三菱UFJ）',
    brands: ['AMEX'],
    fee: 22000,
    feeNote: null,
    pointSystem: '三菱UFJグローバルポイント',
    psType: 'psite',
    rates: { ANA: 0, JAL: 0.8, KF: 0.8, MB: 0, ALL: 0.8 },
  },
  {
    id: 'jal-amex-plat',
    name: 'JALアメックスプラチナカード',
    issuer: 'American Express（JAL）',
    brands: ['AMEX'],
    fee: 34100,
    feeNote: null,
    pointSystem: 'JALマイル直接',
    psType: 'referral',
    rates: { ANA: 0, JAL: 1.0, KF: 0, MB: 0, ALL: 1.0 },
  },
  {
    id: 'jal-club-a',
    name: 'JAL CLUB-Aゴールドカード',
    issuer: 'VISA / MC / JCB / Diners',
    brands: ['VISA', 'MC', 'JCB', 'Diners'],
    fee: 17600,
    feeNote: 'ショッピングマイルプレミアム（年3,300円）自動付帯で100円=1マイルを実現。年会費に含む。',
    pointSystem: 'JALマイル直接（ショッピングマイル・プレミアム）',
    psType: 'psite',
    rates: { ANA: 0, JAL: 1.0, KF: 0, MB: 0, ALL: 1.0 },
  },
  {
    id: 'saison-gold',
    name: 'セゾンゴールド アメックスカード',
    issuer: 'American Express（セゾン）',
    brands: ['AMEX'],
    fee: 11000,
    feeNote: '※JAL0.75%はセゾンマイルクラブ（年9,900円）加入前提。実質年会費20,900円（カード11,000円＋マイルクラブ9,900円）。',
    pointSystem: 'JALマイル直接（セゾンマイルクラブ経由）',
    psType: 'psite',
    rates: { ANA: 0, JAL: 0.75, KF: 0, MB: 0, ALL: 0.75 },
  },
  {
    id: 'diners',
    name: 'ダイナースクラブカード',
    issuer: 'ダイナースクラブ（三井住友トラスト）',
    brands: ['Diners'],
    fee: 29700,
    feeNote: '初年度年会費無料キャンペーン実施中（時期により変動）',
    pointSystem: 'ダイナースクラブリワードポイント',
    psType: 'psite',
    rates: { ANA: 1.0, JAL: 0.4, KF: 0, MB: 0, ALL: 1.0 },
  },
  {
    id: 'mb-std',
    name: 'マリオットBonvoy アメックス（一般）',
    issuer: 'American Express',
    brands: ['AMEX'],
    fee: 34100,
    feeNote: null,
    pointSystem: 'マリオットBonvoy',
    psType: 'referral',
    rates: { ANA: 0.833, JAL: 0.833, KF: 0.833, MB: 2.0, ALL: 0.833 },
  },
  {
    id: 'hilton',
    name: 'ヒルトンHonors アメックスカード',
    issuer: 'American Express',
    brands: ['AMEX'],
    fee: 17600,
    feeNote: 'ヒルトンHonorsポイントはマイル換算率が低い（0.20%）。ホテル宿泊での直接利用が高価値。',
    pointSystem: 'ヒルトンオナーズポイント',
    psType: 'referral',
    rates: { ANA: 0.20, JAL: 0.20, KF: 0.20, MB: 2.0, ALL: 0.20 },
  },
  {
    id: 'rakuten-pre',
    name: '楽天プレミアムカード',
    issuer: 'Visa / Mastercard / JCB / American Express',
    brands: ['VISA', 'MC', 'JCB', 'AMEX'],
    fee: 11000,
    feeNote: '楽天ポイント1.0%→ANAマイル換算50%→実質マイル0.5%。楽天SPU活用者は実質高効率。',
    pointSystem: '楽天ポイント',
    psType: 'psite',
    rates: { ANA: 0.5, JAL: 0.5, KF: 0, MB: 0, ALL: 0.5 },
  },
  {
    id: 'smcc-gold-nl',
    name: '三井住友カード ゴールド（NL）',
    issuer: 'Visa / Mastercard',
    brands: ['VISA', 'MC'],
    fee: 5500,
    feeNote: '年100万円以上決済で翌年以降永年無料（200万円/年なら2年目から無料）。',
    pointSystem: 'Vポイント',
    psType: 'psite',
    rates: { ANA: 0.3, JAL: 0, KF: 0, MB: 0, ALL: 0.3 },
  },
  {
    id: 'jcb-gold',
    name: 'JCBゴールドカード',
    issuer: 'JCB',
    brands: ['JCB'],
    fee: 11000,
    feeNote: '初年度年会費無料。マイル換算率は低い（約0.3%）。JCBプラチナへの招待（PP付帯）を狙う登竜門カード。',
    pointSystem: 'Oki Dokiポイント（JCB）',
    psType: 'psite',
    rates: { ANA: 0.3, JAL: 0.3, KF: 0, MB: 0, ALL: 0.3 },
  },
  {
    id: 'amex-green',
    name: 'アメックスグリーンカード',
    issuer: 'American Express',
    brands: ['AMEX'],
    fee: 13200,
    feeNote: 'ANA移行は「MRプラス」年3,300円＋「MRアナコース」年5,500円が必要（合計22,000円）。',
    pointSystem: 'AMEXメンバーシップ・リワード',
    psType: 'referral',
    rates: { ANA: 1.0, JAL: 0.4, KF: 0.8, MB: 0, ALL: 1.0 },
  },
  {
    id: 'sq-jcb-gold',
    name: 'SQクリスフライヤーJCBゴールドカード',
    issuer: 'JCB（シンガポール航空）',
    brands: ['JCB'],
    fee: 11000,
    feeNote: 'クラシックカード（年会費2,200円）も同じ100円=1KFマイルだが、旅行保険が大幅に低く入会ボーナスも少ない（2,000マイル）。200万円以上の決済者にはゴールドを推奨。',
    pointSystem: 'KrisFlyerマイル直接',
    psType: 'psite',
    rates: { ANA: 0, JAL: 0, KF: 1.0, MB: 0, ALL: 1.0 },
  },
  {
    id: 'sq-smbc-visa',
    name: 'SQクリスフライヤーVISAゴールドカード',
    issuer: '三井住友カード（シンガポール航空）',
    brands: ['VISA'],
    fee: 11000,
    feeNote: 'クラシックカード（年会費2,200円）も同じ100円=1KFマイル。入会ボーナスはGold・Classic共に2,000マイル。VISAブランドが必須の場合はこちら。',
    pointSystem: 'KrisFlyerマイル直接',
    psType: 'psite',
    rates: { ANA: 0, JAL: 0, KF: 1.0, MB: 0, ALL: 1.0 },
  },
];

// Node.js等でのテスト用（ブラウザのscriptタグ読み込みでは無視されます）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CARD_RATES, mbBatchToMiles };
}
