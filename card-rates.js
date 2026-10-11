/* ============================================================
 * card-rates.js  ── マイル最強クレカ診断ツールのカードデータ（単一の正データ）
 * ------------------------------------------------------------
 * 【このファイルの役割】
 *  mile-card-tool.html が表示・計算に使うカード情報をすべてここに集約しています。
 *  年会費・還元率・特典・入会キャンペーン・注意事項などの「事実データ」を
 *  更新するときは、このファイルだけを書き換えれば反映されます。
 *  （mile-card-tool.html 側は画面表示と計算ロジックだけを持ちます）
 *
 * 【カード1枚ごとの主なフィールド】
 *  id          : カードの一意な識別子（URL共有・比較機能でも使うため変更しない）
 *  checked     : 最終確認日（公式サイトと照合した日）。数値を直したら必ず更新
 *  sources     : 出典URL（公式ページ）
 *  pointSystem : 基本ポイントが帰属するポイント経済圏（将来のシーン別獲得率表用）
 *  name / issuer / brands / fee / feeNote / psType : 基本情報
 *  rates       : マイル換算後の実質還元率（%）の表示用代表値 {ANA,JAL,KF,MB,ALL}
 *  milesCalc   : 年間決済額（万円）から獲得マイル数を計算する関数
 *                ※ rates を変えたら、milesCalc 内の係数も同じ値に直すこと
 *  extraFees / anaCap : 移行に必要な追加費用・ANA年間移行上限
 *  その他（desc, alerts, outlook, bonusCurrent など）: 画面に出る説明文・キャンペーン情報
 *
 * 【読み込み方】 mile-card-tool.html で本ファイルを先に読み込みます。
 *   <script src="./card-rates.js"></script>
 * ============================================================ */

// データ全体の最終確認日（画面の「○年○月○日更新」表示に使用）
const CARD_DATA_META = { lastChecked: '2026-10-07', lastCheckedLabel: '2026年10月7日' };

// 目標設定の既定値（1人あたり必要マイル）。特典航空券の必要マイル改定時はここを更新
const GOAL_MPP = { ANA:95000, JAL:80000, KF:109000, MB:55000, ALL:109000 };

// 目標の説明（目標マイルは「人数×1人あたり必要マイル」で計算）
const GLBL={
  ANA:'ANA 東京-SIN ビジネス往復（ハイシーズン 95,000マイル/人）',
  JAL:'JAL 東京-SIN ビジネス往復（最低 80,000マイル/人・変動制）',
  KF:'KF Saver 東京-SIN ビジネス往復（片道54,500×往復）',
  MB:'マリオット系ホテル 1泊55,000pt×泊数（目安）',
  ALL:'KF Saver 東京-SIN ビジネス往復（片道54,500×往復）',
};
// マリオットポイント→マイル（3pt=1マイル、60,000ptごとに5,000マイルのボーナス）
function mbmi(pt){const b=Math.floor(pt/60000);return b*25000+Math.round((pt%60000)*(20000/60000))}
const ANA_CAP_NOTE='ANAマイルへの移行は年4万マイルまで';

// ━━━━━━━━ カードデータ（19枚・2026年10月7日確認） ━━━━━━━━
// extraFees：選んだマイルへの移行に必要な年間参加費（カード年会費とは別）
// anaCap：ANAマイルへの年間移行上限（ALL表示はANAとして扱うカードのみ）

const CARDS=[
  {
    id:'mb-pre',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.americanexpress.com/ja-jp/credit-cards/marriott-bonvoy-premium/'], // 出典（公式ページ）
    pointSystem:"マリオットBonvoy",
    name:'マリオットBonvoy アメックスプレミアム',issuer:'American Express',tagline:'40社超マルチ移行 × 最大1.25% — マイル先送り型の最終兵器',bonusMilesApprox:75000,bonusMbPt:true,bonusFeeWaiver:0,
    psType:'referral',
    fee:82500,feeNote:'2025年8月21日以降の申込み・既存会員は順次（旧49,500円）。',ac:'linear-gradient(90deg,#7C3AED,#F97316)',
    brands:['AMEX'],
    rates:{ANA:1.25,JAL:1.25,KF:1.25,MB:3.0,ALL:1.25},
    milesCalc(man,t){const pt=man*10000*.03;return t==='MB'?pt:mbmi(pt)},
    pp:'no',noExp:true,ins:true,multi:true,hotel:false,
    freeNight:'年間400万円以上の利用とカード継続で、1泊75,000ポイントまでの無料宿泊特典（手持ちポイントを最大25,000ポイント追加可能）。世界中のマリオット系列ホテルが対象で、シンガポールのホテルでも利用可。年200〜300万円の決済では条件に届きません（改定前は150万円条件）。',
    lounge:'国内主要空港カードラウンジのみ（2025年6月1日以降、国内16空港＋ハワイ1空港）。同伴者1名まで無料。プライオリティ・パスなどの海外ラウンジ付帯なし。',
    desc:'ANA/JAL/KF等40社以上に移行可能。60,000ptをまとめて移行すると5,000マイルのボーナスで25,000マイル（1.25%相当）。60,000ptに届かない端数分はボーナスなし（1.0%相当）。マリオットポイントは24か月間の獲得・利用がないと失効しますが、カードを使っていれば実質無期限。マイル種別を後から決めたい人向け。',
    alerts:[{d:'2025年8月〜改定',t:'年会費49,500円→82,500円。無料宿泊条件150万円→400万円（上限は75,000ptに拡大）。公共料金・税金等のポイントは200円=3pt→200円=1ptに減少、事業用決済はポイント対象外。'},{d:'2026年7月改定',t:'海外旅行傷害保険の「携行品損害」補償が終了。その他の補償は継続。'}],
    outlook:{risk:'high',items:[{y:'2026〜2027年',i:'⚠️',t:'年会費・特典の再改定の可能性。マリオットとアメックスの提携更新時期に注意。'},{y:'安定要素',i:'✅',t:'マリオットポイントの多様な移行先は維持の見込み。'}]},
    referral:{r:'アメックスの紹介プログラム経由で、公式サイトより多いポイントが付与されるケースがあります。',c:'紹介特典の内容は時期・紹介者のカード種別で変わります。'},
    bonusCurrent:{p:'2026年10月7日確認',t:'マリオット公式サイト掲載：入会後6か月以内に150万円以上の利用で75,000ボーナスポイント（通常ポイントは別）。期間・条件は申込前に公式でご確認ください。'},
    bonusHistory:[{p:'2026年8〜10月',t:'6ヶ月150万円条件で最大100,000pt（期間限定）。'},{p:'2026年前半',t:'6ヶ月150万円条件で95,000pt前後。'}],
  },
  {
    id:'saison-plat',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.saisoncard.co.jp/amex/platinumbusiness/'], // 出典（公式ページ）
    pointSystem:"JALマイル直接（セゾンマイルクラブ経由）",
    name:'セゾンプラチナ ビジネスアメックス',issuer:'クレディセゾン（American Express）',tagline:'JAL最高水準1.125% + PP付帯 — JAL派の有力候補',bonusMilesApprox:0,bonusFeeWaiver:33000,
    psType:'psite',
    fee:33000,feeNote:'JAL1.125%はSAISON MILE CLUB（年5,500円）加入が前提。実質年会費38,500円（カード33,000円＋マイルクラブ5,500円）。',ac:'linear-gradient(90deg,#E11D48,#F97316)',
    brands:['AMEX'],
    extraFees:{JAL:5500,ALL:5500},
    rates:{ANA:0,JAL:1.125,KF:0,MB:0,ALL:1.125},
    milesCalc(man,t){return(t==='JAL'||t==='ALL')?man*10000*.01125:0},
    pp:'yes',noExp:false,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'プライオリティ・パス（プレステージ会員）付帯。',
    desc:'SAISON MILE CLUB加入で、1,000円=10マイル＋2,000円=永久不滅ポイント1pt（JALマイルに交換して合計1.125%）。プライオリティ・パス付帯。初年度年会費無料。マイルは自動でJALマイルになるため、マイルの有効期限（36か月）に注意。',
    alerts:[],
    outlook:{risk:'mid',items:[{y:'注意点',i:'⚠️',t:'SAISON MILE CLUBのサービス年会費（現在5,500円/年）は過去に有料化された経緯があり、今後の値上げリスクあり。'},{y:'安定要素',i:'✅',t:'JALとセゾンの提携は長期安定。'}]},
    referral:{r:'セゾンカードの紹介キャンペーン経由で追加ポイントが付与される場合あり。',c:'常設ではなく期間限定。'},
    bonusCurrent:{p:'2026年10月時点',t:'初年度年会費無料（通常33,000円）。その他の入会特典は時期により変わります。'},
    bonusHistory:[{p:'2025〜2026年',t:'初年度年会費無料が継続。'}],
  },
  {
    id:'amex-gold-pref',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.americanexpress.com/ja-jp/credit-cards/gold-preferred-card/'], // 出典（公式ページ）
    pointSystem:"AMEXメンバーシップ・リワード",
    name:'アメックスゴールド・プリファード',issuer:'American Express',tagline:'13社マルチ + 入会キャンペーン大 — 初年度爆積みの定番カード',bonusMilesApprox:110000,bonusMrPt:true,bonusFeeWaiver:0,
    psType:'referral',
    fee:39600,feeNote:'ANA移行は「メンバーシップ・リワードANAコース」年5,500円が別途必要（年間移行上限40,000マイル）。メンバーシップ・リワード・プラスは無料で自動付帯。JAL移行は2,500pt→1,000マイル（0.4%）。',ac:'linear-gradient(90deg,#F59E0B,#EF4444)',
    brands:['AMEX'],
    extraFees:{ANA:5500,ALL:5500},anaCap:40000,
    rates:{ANA:1.0,JAL:0.4,KF:0.8,MB:0,ALL:1.0},
    milesCalc(man,t){
      const r={ANA:0.010,JAL:0.004,KF:0.008,ALL:0.010}[t]||0;
      return man*10000*r;
    },
    pp:'warn',noExp:true,ins:true,multi:true,hotel:false,
    freeNight:'フリー・ステイ・ギフト：年間200万円以上の利用とカード継続で、国内の対象ホテルの1泊2名分の無料宿泊券。日本国内限定のため海外ホテルは対象外。',
    lounge:'プライオリティ・パス（スタンダード会員・年会費無料）。ラウンジ利用は年2回まで無料、3回目以降$35/回。国内主要空港カードラウンジ（同伴者1名まで無料）も利用可。',
    desc:'ANA/JAL/KFなど13社に移行可能なマルチカード。ANA1.0%（ANAコース5,500円別途・年4万マイルまで）、KF0.8%、JAL0.4%。ポイントは最初から無期限。Amazon・Yahoo!ショッピング・ヨドバシ・JAL公式サイトなど対象加盟店で100円=3ポイント（ボーナスは年10,000ptまで）。',
    alerts:[{d:'注意',t:'ANAマイルの年間移行上限は40,000マイル（アメックスのカードを複数持つ場合は合算）。入会ボーナス込みでANAに移す場合、すべて移すには複数年かかります。'},{d:'2026年7月改定',t:'海外旅行傷害保険の「携行品損害」補償が終了。その他の補償は継続。'}],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'2024年に登場した比較的新しいカード。2026年8月にはOne Harmonyロイヤルステータスなど特典追加も。'},{y:'注意点',i:'⚠️',t:'対象加盟店やボーナス上限など、細部の改定には注意。'}]},
    referral:{r:'アメックスの紹介プログラム経由で、公式サイトより多いポイントが付与されるケースがあります。',c:'申込ルートにより獲得ポイント数が異なります。'},
    bonusCurrent:{p:'2026年10月7日確認',t:'条件達成で合計最大120,000pt（ボーナス110,000pt＋通常ポイント10,000pt）。年200〜300万円の決済ペースなら6ヶ月以内の達成が見込める水準。'},
    bonusStages:[
      {cond:'入会後3ヶ月以内に合計50万円以上のカード利用',pt:'+30,000pt'},
      {cond:'入会後6ヶ月以内に合計100万円以上のカード利用（上記と合算可）',pt:'+80,000pt'},
      {cond:'合計100万円利用時点の通常ポイント（100円=1pt）',pt:'+10,000pt'},
    ],
    bonusAsOf:'2026年10月7日',bonusApplyBy:'2026年8月6日以降の公式キャンペーン',
    bonusHistory:[{p:'2026年8月〜',t:'3万＋8万＋通常1万の計12万pt。'},{p:'2025〜2026年前半',t:'10万〜14万pt前後で推移。'}],
  },
  {
    id:'ana-amex-gold',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.americanexpress.com/ja-jp/credit-cards/ana-gold-card/'], // 出典（公式ページ）
    pointSystem:"ANAマイル直接",
    name:'ANAアメックスゴールドカード',issuer:'American Express（ANA）',tagline:'ANA移行の年間上限なし × 利用ボーナス — ANA一直線のアメックス',bonusMilesApprox:108000,bonusFeeWaiver:0,
    psType:'referral',
    fee:42900,feeNote:'2026年9月2日以降の申込みは年会費42,900円（旧34,100円・既存会員は順次）。ANAマイルへの移行はコース登録・参加費不要で、年間移行上限もなし。',ac:'linear-gradient(90deg,#0EA5E9,#2563EB)',
    brands:['AMEX'],
    rates:{ANA:1.0,JAL:0,KF:0,MB:0,ALL:1.0},
    milesCalc(man,t){
      if(t!=='ANA'&&t!=='ALL')return 0;
      const base=man*10000*.010;
      const bonus=man>=400?15000:0; // 年400万円以上で15,000マイル
      return base+bonus;
    },
    pp:'warn',noExp:true,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'プライオリティ・パス（スタンダード会員）。ラウンジ利用は年2回まで無料、3回目以降$35/回。羽田空港第2ターミナル「POWER LOUNGE PREMIUM」は同伴者1名まで無料。国内主要空港カードラウンジも利用可。',
    desc:'カード利用100円=1ポイント→1,000ポイント=1,000ANAマイル（1.0%）。プロパーのアメックスと違いANAマイルへの年間移行上限がなく、ポイントも無期限。年400万円以上の利用で15,000マイルの利用ボーナス（本ツールでは400万円設定時に加算）。搭乗ボーナスマイル25%・継続ボーナス毎年2,000マイル。',
    alerts:[{d:'2026年9月改定',t:'年会費が34,100円→42,900円に。年400万円利用で15,000マイル、POWER LOUNGE PREMIUM、ダイニング20%キャッシュバック（年2万円まで）が新設。'},{d:'2026年7月改定',t:'海外旅行傷害保険の「携行品損害」補償が終了。その他の補償は継続。'}],
    outlook:{risk:'mid',items:[{y:'注意点',i:'⚠️',t:'2026年9月に年会費が約26%値上げ。利用ボーナスの400万円条件を満たせないと、値上げ分の回収は入会初年度以外は難しい。'},{y:'安定要素',i:'✅',t:'ANAとアメックスの提携は2009年から継続。'}]},
    referral:{r:'アメックスの紹介プログラム経由で上乗せが付く場合あり。',c:'ANAアメックスシリーズを過去に保有していた人は新規入会特典の対象外。'},
    bonusCurrent:{p:'2026年9月2日〜11月4日申込分',t:'条件達成で最大128,000マイル相当（入会2,000マイル＋3ヶ月以内200万円利用で93,000pt＋13,000マイル＋通常ポイント20,000pt）。ボーナスマイルは2027年6月末頃に有効期限12か月の期間限定マイルで付与。'},
    bonusStages:[
      {cond:'入会ボーナスマイル（年会費支払い後）',pt:'+2,000マイル'},
      {cond:'入会後3ヶ月以内に合計75万円以上の利用',pt:'34,000マイル相当'},
      {cond:'入会後3ヶ月以内に合計150万円以上の利用',pt:'75,000マイル相当'},
      {cond:'入会後3ヶ月以内に合計200万円以上の利用',pt:'106,000マイル相当'},
    ],
    bonusAsOf:'2026年10月7日',bonusApplyBy:'2026年11月4日申込分まで（ANA公式キャンペーンページ）',
    bonusHistory:[{p:'2025年10月〜2026年8月',t:'60万/100万/180万円の3段階で最大7万マイル前後。'},{p:'2026年9月〜',t:'リニューアル記念で最大128,000マイル相当に拡大。'}],
  },
  {
    id:'sora',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.jcb.co.jp/ordercard/teikei/ana_tome.html'], // 出典（公式ページ）
    pointSystem:"ANAマイル直接（ANA Pay二重取り）",
    name:'ソラチカゴールドカード',issuer:'JCB（ANA To Me CARD PASMO JCB GOLD）',tagline:'ANA1.0%・移行手数料不要 — ANAゴールド最安水準',bonusMilesApprox:0,bonusFeeWaiver:0,
    psType:'psite',
    fee:15400,feeNote:null,ac:'linear-gradient(90deg,#0EA5E9,#22C55E)',
    brands:['JCB'],
    rates:{ANA:1.0,JAL:0,KF:0,MB:0,ALL:1.0},
    milesCalc(man,t){return(t==='ANA'||t==='ALL')?man*10000*.010:0},
    pp:'warn',noExp:false,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'プライオリティ・パスは付帯なし。ラウンジ・キー（LoungeKey）で海外空港ラウンジを優待価格（有料）で利用可。国内主要空港カードラウンジは無料。',
    desc:'2マイルコース（J-POINT 200円=1pt→2マイル）で1.0%、ゴールドは移行手数料無料。ANAゴールドカードの中では年会費が最安水準。東京メトロ乗車でメトロポイントも貯まる。マイルは自動でANAマイルになるため、有効期限（36か月）に注意。',
    alerts:[],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'JCBとANAの提携は長期安定。'},{y:'注意点',i:'⚠️',t:'メトロポイント関連の特典は改定されることがある。'}]},
    referral:{r:'JCBの紹介キャンペーン（不定期）あり。',c:'ポイントサイト経由との比較を。'},
    bonusCurrent:{p:'2026年10月時点',t:'JCB公式で入会キャンペーン（最大51,000マイル相当と表示）を実施中。条件の確認が必要なため、初年度モードでは加算していません。'},
    bonusHistory:[{p:'2025〜2026年',t:'1万〜5万マイル相当のキャンペーンが断続的に実施。'}],
  },
  {
    id:'ana-wide-g',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.jcb.co.jp/ordercard/teikei/ana_card.html'], // 出典（公式ページ）
    pointSystem:"ANAマイル直接",
    name:'ANAワイドゴールドカード',issuer:'JCB / 三井住友カード（VISA・Mastercard）',tagline:'ANA直接付与 × 3ブランド — シンプル積立の定番',bonusMilesApprox:0,bonusFeeWaiver:0,
    psType:'psite',
    fee:15400,feeNote:null,ac:'linear-gradient(90deg,#2563EB,#0EA5E9)',
    brands:['JCB','VISA','MC'],
    rates:{ANA:1.0,JAL:0,KF:0,MB:0,ALL:1.0},
    milesCalc(man,t){return(t==='ANA'||t==='ALL')?man*10000*.010:0},
    pp:'no',noExp:false,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'国内主要空港カードラウンジのみ。プライオリティ・パスなどの海外ラウンジ付帯なし。',
    desc:'ゴールドは移行手数料無料の上位コースで1.0%（コース名は発行会社により異なる。JCBは2マイルコース）。JCB/VISA/MCから選べる汎用性が魅力。マイルの有効期限（36か月）に注意。',
    alerts:[],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'ANA直接付与のシンプルな構造。'},{y:'注意点',i:'⚠️',t:'発行会社ごとにポイント制度が異なる（JCBはJ-POINT、VISA/MCはVポイント）。'}]},
    referral:{r:'ANAカードの紹介プログラム（マイ友プログラム）あり。',c:'発行会社ごとにキャンペーンが異なります。'},
    bonusCurrent:{p:'2026年10月時点',t:'入会キャンペーンは発行会社・時期により異なります。公式サイトでご確認ください（初年度モードでは加算していません）。'},
    bonusHistory:[{p:'2025〜2026年',t:'入会・利用ボーナスで数万マイル相当のキャンペーンが断続的に実施。'}],
  },
  {
    id:'mufg-plat',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.cr.mufg.jp/amex/platinum/index.html'], // 出典（公式ページ）
    pointSystem:"三菱UFJグローバルポイント",
    name:'三菱UFJカード・プラチナ・アメックス',issuer:'三菱UFJニコス（American Express）',tagline:'PP付帯プラチナ22,000円 × 家族PP可 — JAL/KF移行も',bonusMilesApprox:0,bonusFeeWaiver:0,
    psType:'psite',
    fee:22000,feeNote:'マイル移行には別途参加費・移行手数料がかかる場合があります（最新の条件は公式でご確認ください）。',ac:'linear-gradient(90deg,#7C3AED,#0EA5E9)',
    brands:['AMEX'],
    rates:{ANA:0,JAL:0.8,KF:0.8,MB:0,ALL:0.8},
    milesCalc(man,t){const r={JAL:.008,KF:.008,ALL:.008}[t]||0;return man*10000*r},
    pp:'yes',noExp:false,ins:true,multi:true,hotel:false,freeNight:null,
    lounge:'プライオリティ・パス（プレステージ会員）付帯・家族カードでも発行可。2024年10月より空港レストラン・リフレッシュ施設は利用不可（ラウンジ本体は利用可）。',
    desc:'プライオリティ・パス付帯プラチナの中で年会費が安い水準（22,000円）。JAL・KFへ0.8%換算（マイレージプログラム登録要）。ANAは高レート移行の対象外。家族カードでもPPを発行できるのが強み。',
    alerts:[],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'低コストPP付帯プラチナという独自ポジション。'},{y:'注意点',i:'⚠️',t:'移行の参加費・手数料の条件は事前に公式で確認を。'}]},
    referral:{r:'三菱UFJニコスの紹介キャンペーンがある場合あり。',c:'アメックス本体の紹介プログラムとは別扱い。'},
    bonusCurrent:{p:'2026年10月時点',t:'2026年9月30日入会分までのキャンペーンは終了。最新は公式サイトでご確認ください。'},
    bonusHistory:[{p:'2025〜2026年',t:'利用額に応じた最大1.5万円相当前後のグローバルポイントのキャンペーン。'}],
  },
  {
    id:'jal-amex-plat',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.jal.co.jp/jp/ja/jalcard/card/amex.html'], // 出典（公式ページ）
    pointSystem:"JALマイル直接",
    name:'JALアメックスプラチナカード',issuer:'American Express（JAL）',tagline:'JAL1.0% + PP無料 × AMEX — JAL派のAMEXブランド選択肢',bonusMilesApprox:0,bonusFeeWaiver:0,
    psType:'referral',
    fee:34100,feeNote:null,ac:'linear-gradient(90deg,#E11D48,#7C3AED)',
    brands:['AMEX'],
    rates:{ANA:0,JAL:1.0,KF:0,MB:0,ALL:1.0},
    milesCalc(man,t){return(t==='JAL'||t==='ALL')?man*10000*.010:0},
    pp:'yes',noExp:false,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'プライオリティ・パス（プレステージ会員）無料・家族会員も登録可。空港レストラン等は利用不可。JALのサクララウンジは別の資格が必要。',
    desc:'ショッピングマイル・プレミアム自動付帯で100円=1マイル（1.0%）。JALグループ航空券等の購入ではアドオンマイルが加算。プライオリティ・パス無料。',
    alerts:[{d:'注意',t:'JALマイルの有効期限は36か月。'}],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'JALとAMEXの長期提携。'},{y:'注意点',i:'⚠️',t:'AMEXは一部加盟店で使えない場合あり。'}]},
    referral:{r:'JALカードの紹介キャンペーンあり。',c:'通常のアメックス紹介プログラムとは別扱い。'},
    bonusCurrent:{p:'2026年10月時点',t:'入会搭乗ボーナスマイル（プラチナは初回搭乗時5,000マイル）が中心。搭乗が条件のため初年度モードでは加算していません。'},
    bonusHistory:[{p:'2025〜2026年',t:'入会搭乗ボーナス＋期間限定の利用キャンペーンが不定期に実施。'}],
  },
  {
    id:'jal-club-a',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.jal.co.jp/jp/ja/jalcard/card/club_a_gold.html'], // 出典（公式ページ）
    pointSystem:"JALマイル直接（ショッピングマイル・プレミアム）",
    name:'JAL CLUB-Aゴールドカード',issuer:'JAL（VISA / Mastercard / JCB）',tagline:'JAL1.0% × 3ブランド — 最もシンプルなJAL直積みカード',bonusMilesApprox:0,bonusFeeWaiver:0,
    psType:'psite',
    fee:17600,feeNote:'ショッピングマイル・プレミアム（通常年4,950円）が自動付帯・無料で100円=1マイル。アメックス版は年会費20,900円。',ac:'linear-gradient(90deg,#E11D48,#FB923C)',
    brands:['VISA','MC','JCB'],
    rates:{ANA:0,JAL:1.0,KF:0,MB:0,ALL:1.0},
    milesCalc(man,t){return(t==='JAL'||t==='ALL')?man*10000*.010:0},
    pp:'no',noExp:false,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'国内主要空港カードラウンジのみ。プライオリティ・パスなどの海外ラウンジ付帯なし。',
    desc:'JAL直接付与1.0%。計算がシンプルで迷いがない。JALマイルは36か月で失効するため計画的に。',
    alerts:[{d:'注意',t:'JALマイルの有効期限は積算月から36か月。'}],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'JAL直接付与の安定した仕組み。'},{y:'注意点',i:'⚠️',t:'特典航空券の必要マイル数の変動制拡大に注意。'}]},
    referral:{r:'JALカードの紹介キャンペーンあり。',c:'期間限定の場合あり。'},
    bonusCurrent:{p:'2026年10月時点',t:'入会キャンペーンはブランド・時期により異なります。公式サイトでご確認ください（初年度モードでは加算していません）。'},
    bonusHistory:[{p:'2025〜2026年',t:'ブランド別の入会キャンペーンが断続的に実施。'}],
  },
  {
    id:'saison-gold',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.saisoncard.co.jp/amextop/gold-pro-14az/'], // 出典（公式ページ）
    pointSystem:"JALマイル直接（セゾンマイルクラブ経由）",
    name:'セゾンゴールド アメックスカード',issuer:'クレディセゾン（American Express）',tagline:'JAL1.125% × 年11,000円 — JALマイル高還元の低コスト入口',bonusMilesApprox:0,bonusFeeWaiver:0,
    psType:'psite',
    fee:11000,feeNote:'JAL1.125%はSAISON MILE CLUB（年9,900円）加入が前提。実質年会費20,900円（カード11,000円＋マイルクラブ9,900円）。',ac:'linear-gradient(90deg,#E11D48,#7C3AED)',
    brands:['AMEX'],
    extraFees:{JAL:9900,ALL:9900},
    rates:{ANA:0,JAL:1.125,KF:0,MB:0,ALL:1.125},
    milesCalc(man,t){return(t==='JAL'||t==='ALL')?man*10000*.01125:0},
    pp:'no',noExp:false,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'国内主要空港カードラウンジ。海外ラウンジの付帯条件は公式でご確認ください。',
    desc:'SAISON MILE CLUB加入で、1,000円=10マイル＋2,000円=永久不滅ポイント1pt（JALマイルに交換して合計1.125%）。マイルクラブのサービス年会費はプラチナ・ビジネス（5,500円）より高い9,900円。',
    alerts:[{d:'注意',t:'マイルクラブ込みの実質年会費は20,900円。セゾンプラチナ・ビジネス（実質38,500円・PP付帯）との差を比較して選びましょう。'}],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'JALとセゾンの提携は安定。'},{y:'注意点',i:'⚠️',t:'マイルクラブ費用の値上げリスクあり。'}]},
    referral:{r:'セゾンの紹介キャンペーンがある場合あり。',c:'期間限定。'},
    bonusCurrent:{p:'2026年10月時点',t:'入会特典は時期により異なります。公式サイトでご確認ください。'},
    bonusHistory:[{p:'2025〜2026年',t:'初年度年会費無料などのキャンペーンが実施されることあり。'}],
  },
  {
    id:'diners',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.diners.co.jp/ja/cardlineup/dinersclubcard.html'], // 出典（公式ページ）
    pointSystem:"ダイナースクラブリワードポイント",
    name:'ダイナースクラブカード',issuer:'三井住友トラストクラブ（ダイナースクラブ）',tagline:'ANA1.0%（年4万マイルまで）× ポイント無期限 — グルメ特典付き',bonusMilesApprox:0,bonusFeeWaiver:0,
    psType:'psite',
    fee:29700,feeNote:'2026年4月以降の年会費29,700円（旧24,200円）。マイル移行にはダイナースグローバルマイレージ（年6,600円）への参加が必要。ANAへの移行は年40,000マイルまで。',ac:'linear-gradient(90deg,#374151,#6B7280)',
    brands:['Diners'],
    extraFees:{ANA:6600,JAL:6600,ALL:6600},anaCap:40000,
    rates:{ANA:1.0,JAL:0.4,KF:0,MB:0,ALL:1.0},
    milesCalc(man,t){const r={ANA:.010,JAL:.004,ALL:.010}[t]||0;return man*10000*r},
    pp:'warn',noExp:true,ins:true,multi:true,hotel:false,freeNight:null,
    lounge:'海外空港ラウンジサービスあり。2025年4月より国内空港レストラン・カフェ等の提携施設は利用不可（ラウンジ本体・海外施設は利用可）。',
    desc:'ポイントは有効期限なし。ANAへは1,000pt=1,000マイル（1.0%・年4万マイルまで）、JALへは2,500pt=1,000マイル（0.4%）。KrisFlyerへの移行には非対応。ダイナースブランドの加盟店制限に注意。',
    alerts:[{d:'2025年4月改悪',t:'国内空港レストラン・カフェ等の提携施設が利用不可に。ラウンジ本体は引き続き利用可。'},{d:'2026年4月改定',t:'年会費が24,200円→29,700円に値上げ。一方で新サービスを追加。'}],
    outlook:{risk:'mid',items:[{y:'注意点',i:'⚠️',t:'年会費・グローバルマイレージ参加料の値上げリスク。'},{y:'安定要素',i:'✅',t:'ポイント無期限という強みは継続。'}]},
    referral:{r:'ダイナースクラブの紹介プログラムあり。',c:'期間限定の場合あり。'},
    bonusCurrent:{p:'2026年10月時点',t:'入会キャンペーンは時期により異なります。公式サイトでご確認ください（初年度モードでは加算していません）。'},
    bonusHistory:[{p:'2025〜2026年',t:'利用額に応じたポイント付与のキャンペーンが断続的に実施。'}],
  },
  {
    id:'mb-std',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.americanexpress.com/ja-jp/credit-cards/card-types/both-marriott-bonvoy-mclp-ieep/'], // 出典（公式ページ）
    pointSystem:"マリオットBonvoy",
    name:'マリオットBonvoy アメックス（一般）',issuer:'American Express',tagline:'マルチ対応・最大0.833% — MBプレミアムのコスト抑え版',bonusMilesApprox:40000,bonusMbPt:true,bonusFeeWaiver:0,
    psType:'referral',
    fee:34100,feeNote:'2025年の改定で公共料金・税金等のポイント付与率が引き下げ、事業用決済はポイント対象外に。',ac:'linear-gradient(90deg,#7C3AED,#A78BFA)',
    brands:['AMEX'],
    rates:{ANA:0.833,JAL:0.833,KF:0.833,MB:2.0,ALL:0.833},
    milesCalc(man,t){const pt=man*10000*.02;return t==='MB'?pt:mbmi(pt)},
    pp:'no',noExp:true,ins:true,multi:true,hotel:false,freeNight:'年間250万円以上の利用とカード継続で、1泊50,000ポイントまでの無料宿泊特典（手持ちポイントを最大25,000ポイント追加可能）。世界中のマリオット系列ホテルが対象。',
    lounge:'国内主要空港カードラウンジのみ。プライオリティ・パスなどの海外ラウンジ付帯なし。',
    desc:'100円=2ポイント。60,000ptをまとめて移行すると最大0.833%（端数部分は0.667%）。プレミアムとの年会費差は48,400円。移行先の柔軟性はプレミアムと同等。',
    alerts:[{d:'2025年8月〜改定',t:'年会費23,100円→34,100円。無料宿泊条件150万円→250万円。公共料金・税金等のポイント付与率引き下げ、事業用決済はポイント対象外。'},{d:'2026年7月改定',t:'海外旅行傷害保険の「携行品損害」補償が終了。その他の補償は継続。'}],
    outlook:{risk:'mid',items:[{y:'注意点',i:'⚠️',t:'プレミアムに続く改悪の流れに注意。'},{y:'安定要素',i:'✅',t:'マリオットポイントの多様な移行先は維持の見込み。'}]},
    referral:{r:'アメックスの紹介プログラムで上乗せが付く場合あり。',c:'時期により内容が変わります。'},
    bonusCurrent:{p:'2026年10月7日確認',t:'マリオット公式サイト掲載：入会後6か月以内に100万円以上の利用で40,000ボーナスポイント（通常ポイントは別）。期間・条件は申込前に公式でご確認ください。'},
    bonusHistory:[{p:'2026年8〜10月',t:'6ヶ月100万円条件で最大55,000pt（期間限定）。'},{p:'2026年前半',t:'45,000pt前後。'}],
  },
  {
    id:'hilton',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.americanexpress.com/ja-jp/credit-cards/hilton-classic-card/'], // 出典（公式ページ）
    pointSystem:"ヒルトンオナーズポイント",
    name:'ヒルトンHonors アメックスカード',issuer:'American Express',tagline:'ヒルトンゴールド自動付帯 — マイルではなくホテル宿泊向け',bonusMilesApprox:16000,bonusMbPt:false,bonusHilton:true,bonusFeeWaiver:0,
    psType:'referral',
    fee:16500,feeNote:'マイル換算効率：100円=2pt、10,000pt=1,000マイル（ANA・JAL）で0.2%と低効率。ホテル宿泊にポイントを使う前提のカード。',ac:'linear-gradient(90deg,#0EA5E9,#164E63)',
    brands:['AMEX'],
    rates:{ANA:0.2,JAL:0.2,KF:0,MB:2.0,ALL:0.2},
    milesCalc(man,t){
      if(t==='MB')return man*10000*.02; // ヒルトンポイント
      const r={ANA:.002,JAL:.002,ALL:.002}[t]||0;return man*10000*r;
    },
    pp:'no',noExp:true,ins:true,multi:true,hotel:false,freeNight:'年間150万円以上の利用とカード継続で、ヒルトンのウィークエンド無料宿泊特典1泊分（金・土・日曜泊）。',
    lounge:'確認できた範囲では、プライオリティ・パスなどの海外ラウンジ付帯はありません（最新の付帯サービスは公式でご確認ください）。',
    desc:'日常の利用で100円=2ヒルトンポイント、ヒルトン系列では100円=3ポイント。ポイントは宿泊に使うと1pt≒0.5円前後の価値になる一方、マイルへの交換は0.2%と低効率。ヒルトン・オナーズ ゴールドステータスが自動付帯。旅行保険は利用付帯。',
    alerts:[],
    outlook:{risk:'mid',items:[{y:'注意点',i:'⚠️',t:'ヒルトンの変動価格制でポイント価値が変動。'},{y:'安定要素',i:'✅',t:'アメックスとヒルトンの提携は安定。'}]},
    referral:{r:'アメックスの紹介プログラム経由で上乗せが付く場合あり。',c:'ヒルトン会員番号との紐付けが必要。'},
    bonusCurrent:{p:'2026年10月時点',t:'入会後3ヶ月以内に合計30万円利用で10,000ボーナスポイント（通常ポイントと合わせて16,000pt）。'},
    bonusStages:[
      {cond:'入会後3ヶ月以内に合計30万円のカード利用',pt:'+10,000pt'},
      {cond:'同利用分の通常ポイント（100円=2pt）',pt:'+6,000pt'},
    ],
    bonusAsOf:'2026年10月7日',bonusApplyBy:null,
    bonusHistory:[{p:'2026年',t:'3ヶ月30万円条件で合計16,000ptが継続。'}],
  },
  {
    id:'rakuten-pre',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.rakuten-card.co.jp/card/rakuten-premium-card/'], // 出典（公式ページ）
    pointSystem:"楽天ポイント",
    name:'楽天プレミアムカード',issuer:'楽天カード',tagline:'楽天経済圏と相性良し × PP年5回 — コスパ型の定番カード',bonusMilesApprox:0,bonusFeeWaiver:0,
    psType:'psite',
    fee:11000,feeNote:null,ac:'linear-gradient(90deg,#E11D48,#F97316)',
    brands:['VISA','JCB','MC','AMEX'],
    rates:{ANA:0.5,JAL:0.5,KF:0,MB:0,ALL:0.5},
    milesCalc(man,t){const r={ANA:.005,JAL:.005,ALL:.005}[t]||0;return man*10000*r},
    pp:'warn',noExp:false,ins:true,multi:true,hotel:false,freeNight:null,
    lounge:'プライオリティ・パス（2025年1月15日以降は年5回まで無料、6回目以降$35/回）。',
    desc:'楽天ポイント→ANA・JALマイル（2pt=1マイル）で0.5%と低効率。楽天市場ヘビーユーザー向けで、マイル効率だけでは選びにくいカード。',
    alerts:[{d:'2025年1月改悪',t:'プライオリティ・パス：無制限→年5回まで無料。6回目以降$35/回。'}],
    outlook:{risk:'high',items:[{y:'注意点',i:'⚠️',t:'PPの利用回数がさらに削減されるリスク。'},{y:'評価',i:'💡',t:'11,000円でPP年5回は低コスト。マイル目的よりPP・楽天SPU目的のカード。'}]},
    referral:{r:'楽天カードの紹介プログラムあり。',c:'紹介者・被紹介者双方にポイント付与される形式。'},
    bonusCurrent:{p:'2026年10月時点',t:'入会特典は数千楽天ポイント程度（時期により変動）。'},
    bonusHistory:[{p:'2025〜2026年',t:'数千ポイント程度の入会特典。'}],
  },
  {
    id:'smcc-gold-nl',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.smbc-card.com/nyukai/card/gold-numberless.jsp'], // 出典（公式ページ）
    pointSystem:"Vポイント",
    name:'三井住友カード ゴールド（NL）',issuer:'三井住友カード',tagline:'年100万円で永年無料 — ANA派初心者のファーストステップ',bonusMilesApprox:0,bonusFeeWaiver:0,
    psType:'psite',
    fee:5500,feeNote:'年100万円以上の利用で翌年以降の年会費が永年無料（初年度5,500円で計算）。年100万円利用で毎年10,000Vポイントのボーナスあり。',ac:'linear-gradient(90deg,#16A34A,#0EA5E9)',
    brands:['VISA','MC'],
    rates:{ANA:0.5,JAL:0,KF:0,MB:0,ALL:0.5},
    milesCalc(man,t){
      if(t!=='ANA'&&t!=='ALL')return 0;
      // 通常0.5%のVポイント→ANAマイル（1pt=0.5マイル）＝0.25%、年100万円達成の10,000pt→5,000マイル
      const base=man*10000*.0025;
      const bonus=man>=100?5000:0;
      return Math.round(base+bonus);
    },
    pp:'no',noExp:false,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'国内主要空港カードラウンジのみ。プライオリティ・パスなどの海外ラウンジ付帯なし。',
    desc:'通常のVポイント（0.5%）をANAマイルに交換すると0.25%。年100万円利用の10,000Vポイント（5,000マイル相当）を加えると、200万円利用で実質0.5%前後。マイル効率よりコスト最優先の人向け。',
    alerts:[{d:'2026年3月改悪',t:'年間100万円利用の集計対象外にau PAYチャージ・Kyash等が追加。'}],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'年100万円で永年無料の仕組みは継続。'},{y:'注意点',i:'⚠️',t:'マイル換算効率は他のゴールドカードより低い。'}]},
    referral:{r:'三井住友カードの紹介プログラムあり。',c:'期間限定のことが多い。'},
    bonusCurrent:{p:'2026年10月時点',t:'入会特典はVポイントで時期により変動。公式サイトでご確認ください。'},
    bonusHistory:[{p:'2025〜2026年',t:'数千〜1万Vポイント前後の入会特典。'}],
  },
  {
    id:'jcb-gold',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.jcb.co.jp/ordercard/kojin_card/gold2.html'], // 出典（公式ページ）
    pointSystem:"Oki Dokiポイント（JCB）",
    name:'JCBゴールドカード',issuer:'JCB',tagline:'JCBプラチナ招待への登竜門 — マイル目的には不向き',bonusMilesApprox:0,bonusFeeWaiver:11000,
    psType:'psite',
    fee:11000,feeNote:'オンライン入会は初年度年会費無料。',ac:'linear-gradient(90deg,#16A34A,#0EA5E9)',
    brands:['JCB'],
    rates:{ANA:0.3,JAL:0.3,KF:0,MB:0,ALL:0.3},
    milesCalc(man,t){const r={ANA:.003,JAL:.003,ALL:.003}[t]||0;return man*10000*r},
    pp:'no',noExp:false,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'国内主要空港とハワイ・ホノルル空港のラウンジが無料。プライオリティ・パスなどの海外ラウンジは付帯なし（上位のJCBゴールド ザ・プレミアのみ）。',
    desc:'J-POINT（旧Oki Dokiポイント。200円=1pt）→ANA/JALマイル（1pt=0.6マイル）で0.3%と低効率。旅行保険などゴールドの付帯サービスは充実。マイル目的なら、年会費15,400円でANA1.0%のソラチカゴールドが候補。',
    alerts:[],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'JCBの長期安定ブランド。'},{y:'注意点',i:'⚠️',t:'マイル換算0.3%はANA系カードと比べて大幅に不利。'}]},
    referral:{r:'JCBの紹介キャンペーン（不定期）あり。',c:'JCB公式サイトで最新情報確認を。'},
    bonusCurrent:{p:'2026年10月時点',t:'入会キャンペーンは時期により異なります。'},
    bonusHistory:[{p:'2025〜2026年',t:'Amazonギフト等で1万〜2万円相当の入会特典が実施されることあり。'}],
  },
  {
    id:'amex-green',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.americanexpress.com/ja-jp/credit-cards/green-card/'], // 出典（公式ページ）
    pointSystem:"AMEXメンバーシップ・リワード",
    name:'アメックスグリーンカード',issuer:'American Express',tagline:'ANA1.0% × 月1,100円 — AMEXブランドのスタートライン',bonusMilesApprox:35000,bonusMrPt:true,bonusFeeWaiver:0,
    psType:'referral',
    fee:13200,feeNote:'月会費1,100円（年13,200円）。ANA1.0%にはメンバーシップ・リワード・プラス（年3,300円）＋ANAコース（年5,500円）が別途必要。JAL・KFのレートアップにもプラス（年3,300円）が必要。',ac:'linear-gradient(90deg,#16A34A,#0EA5E9)',
    brands:['AMEX'],
    extraFees:{ANA:8800,JAL:3300,KF:3300,ALL:8800},anaCap:40000,
    rates:{ANA:1.0,JAL:0.4,KF:0.8,MB:0,ALL:1.0},
    milesCalc(man,t){
      const r={ANA:.010,JAL:.004,KF:.008,ALL:.010}[t]||0;
      return man*10000*r;
    },
    pp:'warn',noExp:true,ins:true,multi:true,hotel:false,freeNight:null,
    lounge:'プライオリティ・パス（スタンダード会員・年会費無料）。ラウンジ利用は1回$35（無料枠なし）。国内主要空港カードラウンジは本人のみ無料。',
    desc:'ANA/JAL/KFなど13社に移行可能。ANAは1.0%（年4万マイルまで）だが移行に年8,800円の参加費がかかるため、実質年会費は22,000円。ポイントは一度でも交換すると無期限。旅行保険は利用付帯。',
    alerts:[{d:'注意',t:'ANAマイルの年間移行上限は40,000マイル（アメックスのカードを複数持つ場合は合算）。'}],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'アメックスの入門カードとして安定。'},{y:'注意点',i:'⚠️',t:'移行の参加費を含めると、ANA系の年会費1万円台のカードと実質コストは近い。'}]},
    referral:{r:'アメックスの紹介プログラムで上乗せが付く場合あり。',c:'紹介対象カードが異なる場合あり。'},
    bonusCurrent:{p:'2026年10月時点',t:'条件達成で合計最大35,000ボーナスポイント＋初月の月会費無料。'},
    bonusStages:[
      {cond:'入会後3ヶ月以内に合計20万円以上のカード利用',pt:'+5,000pt'},
      {cond:'入会後6ヶ月以内に合計50万円以上のカード利用（上記と合算可）',pt:'+15,000pt'},
      {cond:'入会後8ヶ月以内、対象加盟店での利用1,000円ごと（上限15,000pt）',pt:'+最大15,000pt'},
    ],
    bonusAsOf:'2026年10月7日',bonusApplyBy:null,
    bonusHistory:[{p:'2025〜2026年',t:'最大35,000ptの3段階構成が継続。'}],
  },
  {
    id:'sq-jcb-gold',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.jcb.co.jp/ordercard/teikei/singapore_card.html'], // 出典（公式ページ）
    pointSystem:"KrisFlyerマイル直接",
    name:'クリスフライヤーJCBカード（一般）',issuer:'JCB（シンガポール航空提携）',tagline:'KFマイル直接付与1.0% × 初年度無料 — 変換費用ゼロのKF最短ルート',bonusMilesApprox:0,bonusFeeWaiver:2750,
    psType:'psite',
    fee:2750,feeNote:'初年度無料、2年目以降2,750円。ゴールド（初年度11,000円・2年目以降16,500円）もマイル付与率は同じ100円=1マイル。',ac:'linear-gradient(90deg,#0C2340,#F97316)',
    brands:['JCB'],
    rates:{ANA:0,JAL:0,KF:1.0,MB:0,ALL:1.0},
    milesCalc(man,t){return(t==='KF'||t==='ALL')?man*10000*.010:0},
    pp:'no',noExp:false,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'空港ラウンジの付帯なし（ラウンジ重視ならゴールド）。',
    desc:'カード利用100円=1KFマイルが自動で積算（変換手続き・費用なし）。マイル付与率はゴールドと同じで、年会費は初年度無料・2年目以降2,750円。海外旅行傷害保険は最高3,000万円。シンガポール航空便の特典航空券は燃油サーチャージがかからない。KFマイルの有効期限（36か月）に注意。',
    alerts:[],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'KFマイル直接付与の仕組みは変更リスクが低い。'},{y:'注意点',i:'⚠️',t:'KrisFlyerの特典チャート改定（2025年11月に実施）で必要マイルが変動。'}]},
    referral:{r:'JCBの紹介キャンペーン（不定期）あり。',c:'ポイントサイト経由との比較を。'},
    bonusCurrent:{p:'2026年10月時点',t:'入会ボーナスマイルは時期により異なります。公式サイトでご確認ください。'},
    bonusHistory:[{p:'2025〜2026年',t:'入会ボーナス数千マイル程度。'}],
  },
  {
    id:'sq-smbc-visa',
    checked:'2026-10-07', // 最終確認日（公式サイト照合日）。数値を見直したらこの日付も更新
    sources:['https://www.smbc-card.com/nyukai/affiliate/krisflyer/index.jsp'], // 出典（公式ページ）
    pointSystem:"KrisFlyerマイル直接",
    name:'クリスフライヤーVISAカード（一般）',issuer:'三井住友カード（シンガポール航空提携）',tagline:'KFマイル直接付与1.0% × 初年度無料 — 最安コストのKFルート',bonusMilesApprox:2000,bonusFeeWaiver:2750,
    psType:'psite',
    fee:2750,feeNote:'初年度無料、2年目以降2,750円。ゴールド（16,500円）もマイル付与率は同じ100円=1マイル。',ac:'linear-gradient(90deg,#0C2340,#E11D48)',
    brands:['VISA'],
    rates:{ANA:0,JAL:0,KF:1.0,MB:0,ALL:1.0},
    milesCalc(man,t){return(t==='KF'||t==='ALL')?man*10000*.010:0},
    pp:'no',noExp:false,ins:true,multi:false,hotel:false,freeNight:null,
    lounge:'空港ラウンジの付帯なし（ラウンジ重視ならゴールド）。',
    desc:'カード利用100円=1KFマイルが自動で積算。マイル付与率はゴールドと同じで、年会費は初年度無料・2年目以降2,750円。海外旅行傷害保険は最高1,000万円（ゴールドは5,000万円）。入会ボーナス2,000マイル。',
    alerts:[],
    outlook:{risk:'low',items:[{y:'安定要素',i:'✅',t:'VISAブランドの広い加盟店網。'},{y:'注意点',i:'⚠️',t:'KrisFlyerマイルの有効期限（36か月）の管理が必要。'}]},
    referral:{r:'三井住友カードの紹介プログラムあり。',c:'ポイントサイト経由との比較を。'},
    bonusCurrent:{p:'2026年10月時点',t:'新規入会で2,000マイル（一般・ゴールド共通）。'},
    bonusHistory:[{p:'2025〜2026年',t:'入会ボーナス2,000マイルが継続。'}],
  },
];

// 旧版 card-rates.js との互換用（シーン別獲得率表などから参照する場合）
const CARD_RATES = CARDS;
function mbBatchToMiles(pt){ return mbmi(pt); }

// Node.js等でのテスト用（ブラウザでは無視されます）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CARDS, CARD_RATES, CARD_DATA_META, GOAL_MPP, GLBL, mbmi, mbBatchToMiles, ANA_CAP_NOTE };
}
