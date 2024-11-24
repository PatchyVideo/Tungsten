/**
 * 在错误页和页底的一言
 * 播放前会被打乱，无需在意顺序
 */
const yiyan: string[] = [
  /**
   * **超重要的头等大事件！！！！**
   */
  '看板娘 Lurantis 要出小恶魔',
  '世界名画《看板娘在女装》',

  /**
   * 名 人 名 言
   */
  '我只是个路过的博丽巫女，给我记住了！',
  '是在这里死亡呢，还是死后留在这里呢，还请选择吧',
  '是~ 这~ 样~ 的~ 吗~',
  '八云紫又过了一个17岁生日',
  '魔理沙偷走了重要的服务器',
  '幽幽子桑，白玉楼的樱花开了',
  '拳打八云敬老院，脚踢红魔幼儿园',
  '你不德豪寺，这寺豪德，这里是豪德寺',

  /**
   * 一些看着会笑和一些看着会 噔 噔 咚 的现实语句
   */
  'Windows 正在更新中，你的电脑将重启多次，请坐和放宽。',
  'Windows 更新失败，正在滚回以前的版本...',
  '我做东方整活页面，好吗？',
  '女巫！八卦炉！Best Match! Are you ready? 普通的黑白魔法使！魔理沙魔理沙魔理沙！Yeah~',
  '我幽幽子，就是饿死，死外边，从白玉楼跳下去，也绝对不碰米斯蒂娅一根毛！A moment later.... 真香诶',
  '敌羞吾去脱她衣',
  '前方到站：幻想乡。请到站的旅客提前到车门前等候，未到站的旅客请不要下车。',
  '欢迎乘坐八云号动车组，本次列车是 GSK999 次列车，列车由博丽神社开往红魔馆，途径雾之湖站。',
  '你知道吗？如果用 TNT 搭建 TNT 阵列塔，一塔的爆炸量相当于9个红魔馆。',
  '灵梦：你这卡保用吗？三花：我一个开卡摊的，能卖你白卡不成？',

  /**
   * 有点你该跑和不该跑的东西
   */
  '$ sudo rm -rf /*',
  '$ curl https://patchyvideo.com/',
  '$ gh repo clone PatchyVideo/platinum',
  '$ gh repo clone PatchyVideo/PatchyVideo',
  '> console.log(\'TOUHOU GUICHU YINMAD\');',

  /**
   * 一点听了之后 DNA 会起反应的音乐歌词
   */
  'パチュリーズ・ベストヒットGSK - IOSYS',
  '色は匂へど  いつか散りぬるを',
  '月には叢雲 華には風と',
  'ずっとその手を離さないでねと微笑った 君とはぐれた',
  'ヒフミ ヒフミ ヒフミ ヒフミ ヒヒフ',
  '上海 上海 上海 上海 蓬莱 蓬莱 蓬莱 蓬莱 フランス オランダ チベット 京都 ロンドン ロシアン オルレアン',
  '「叡智」　が、ありますように。「志操」　と、ありますように。「希望」　で、ありますように。やがて　「世界」になりますように。',
  '芽生え終えた生命よ 彷徨いの冥で逢おう',
  'Humpty Dumpty sat on a wall. Humpty Dumpty had a great fall. All the king\'s horses and king\'s men. Couldn\'t put Humpty together again.',
  '一句不经意平凡话语，剪断最后的一根神经，我的天空开始崩坏离析。',
  '回首 切切低語向苍茫，客星擦過天際夜朦朧，昏暗黎明前悠悠昤唱傳誦之歌 破長空。',
  '彷徨う森の外れに ひとひらの灯 酔いの様に揺らめいて 私を誘っている',
  '微睡み瞳閉じれば 幾千の花びら 風を跨ぎ瞬いて 憐み唄う',

  /**
   * 伪 古 代 艺 术
   */
  '先代巫女末年，略复不省事，人多怨之。因自叹曰：“人言我愦愦，后人当思此愦愦。”后灵梦为幻想乡，人多思之。',
  '萃香坐神社中，目博丽巫女，抚箱而叹曰：“愁肠长辘辘，壶中酒不空。”时守矢巫女方至，博丽指之，曰：“不效此辈，乃至于斯。”早苗于是阴怨灵梦。',
  '蕾米之心，日益骄固。冰精叫，雾湖举。芙兰一炬，可怜焦土。',
  '蕾米莉亚问七曜贤者：“博丽、守矢，巫女也，吾将从之，则何如？”对曰：“以雾之湖为池，赤馆为城，十六夜为政于内，美铃御敌于外，谨修内德，彰喻教化，近和妖精， 远化毛玉，则幻想乡之事，未可知也。',
  '博丽巫女下大图书馆，屠破时钟塔，赤馆震恐。蕾米莉亚乃素服自缚，牵羊而出，迎之馆门。巫女大喜，执羊而走，曰：“本为些许柴米，不意竟得此羊！”赤馆遂全。',
  '七曜贤者责蕾米曰：“姊之为姊，未曾初见教芙兰也。”蕾米答曰：“吾自教之耳。”芙兰从旁过，闻言对曰：“幸无所成。”',
  '博丽巫女常忧其贫，而八云氏多讥之。一日见巫女，巫女以清茶待之。八云于是笑曰：“身居陋室，箪食瓢饮，欲效先贤乎？”，则曰：“吾忧其贫，或忧其老。贫者易安，老者难回。”',
  '幽幽子饥甚，遣妖梦外出抄掠。妖梦掳米斯蒂娅等归。及见幽幽子，众皆垂泪。幽幽子不忍，持之手为涕泣良久。于是亲解其缚，执手躬自送诸庖厨。',
  '或问八云氏：“忆君少时，为博丽结界，数有功焉。今老矣，奈何愦愦竟日也？”对曰：“功遂身退，天之道也。吾其身退，逐成巫女之名矣。”',
  '芙兰以姊无威仪，固多轻之。常于众而论，曰：“使吾为赤馆，当抚四方。”七曜贤者闻之，见芙兰曰：“向使君为赤馆，将何如？”曰：“以力以威，以平四境。”对曰：“如此则殆矣。赤馆虽强，人不过其万一，地不过方十里，惟修内德，穆上下，使知礼而不加饥馑已矣。”芙兰乃愧，终不复轻姊。',
  '芙兰游学于人里，从慧音学史，十日竟反。蕾米不说，曰：“学如积万仞之山，日增尺寸，乃有所长，归何为？”芙兰曰：“今日十五，不归何为？”',
  '慧音东游，见四妖精辩日，问其故。桑尼曰：“我以日始出时去人近，而日中时远也。” 露娜以日初出远，而日中时近也。 斯塔曰：“日初出大如车盖，及日中则如盘盂，此不为远者小而近者大乎？” 冰精则驳之：“日初出沧沧凉凉，及其日中如探汤，此不为近者热而远者凉乎？” 慧音不能决也。众妖精笑曰：“孰为汝多知乎？”',
  '余闻人语，曰尝于网吧见一男，击键盘甚急，时高声疾呼，时哀怨恼怒，人之四态，须臾而毕见焉。忽猛摔键盘，而身痉挛不止，面扭曲难以名状，口中有白沫出。旁人大惊，趁其意识尚存，惑问其故。其人曰：“打则死路一条。”语毕，昏死不能省。',
  '稗田家修《求闻史记》，至《八云列传》，阿礼记曰：“八云氏凡万有一十七岁矣。”紫乃大忿，则稗田家寿皆不过三十，然《八云列传》固如是。直至阿求，始改《八云列传 》为：“八云氏十七，芳华正好。”紫大喜曰：“汝寿可至九十九也！”',
  '八云氏谓芙兰：“幼而不孙姊，不闻孝悌之道，长恐无所述矣。”芙兰闻之，答曰：“诚如所言。吾亦闻老而不死，是为贼也。',

  /**
   * 群友贡献的生草弹幕，排名不分先后
   * https://docs.qq.com/doc/DRVF2Q2xHeWNhd3R1
   * 些许有微调以适应总体语法，具体以源文件为准
   */
  '看板娘真可爱Q-1AQ',
  '此生手贱入东方，来世炸穿幻想乡',
  '千年尽葬妖西行，风华绝代墨染樱',
  '希腊奶~',
  '网站的存在被慧音消除了',
  '谁能想到，这位17岁的少女17年前还是17岁',
  'kono  Padio.Brando da!',
  '⑨⑨⑨⑨⑨⑨⑨⑨',
  '芙兰朵露在个人演唱会上引爆全场',
  '“春天来了喔！”莉莉白话音未落，当场使出一套咏春拳与红师傅打的难解难分',
  '我军打则必胜',
  '世道不公啊，藤原妹红被赶出加油站',
  '国の生死を間に合わせて，災いの福に避けられるものか',
  'そこの紅白！私の書斎で暴れない',
  '派手な魔法でなければ魔法じゃない。弾幕は火力だぜ！',
  'ちょうじゃ が みた ちゅうなんかい の げんふうけい',
  '阿吽不见了，用搜狗浏览器找不到，急死我了',
  '願わくは　花の下にて　春死なむ　その如月の望月のころ',
  'あなたの持ってるなけなしの春を　すべて頂くわ！',
  '今宵は永い夜になるだろう。',
  '巫女のくせに神を食べようだなんて 笑止千万、不届き千万!',
  '"Sanae is a good girl"',
  'it\'s a moriya shrine conspiracy!',
  'Christ on a bike',
  '因为患有密集恐惧症，上白泽慧音拒绝召开校庆大会',
  '无可奉告',
  '谢谢你，古明地恋　不用谢，射命丸文',
  '爷是阿吽  爷是华扇',
  'Awoo~Awoo~Awoo~',
  '十年疮痍，感谢有你',
  '吃我大麻将山啦！',
  '芙兰朵露百年来在地下室闭关苦练麻将，后与神妈在神圣庄严的古战场平分秋色',
  '河意志科学技术世界第一！！！',
  '北饮da☆ze、未至、道渴而死，弃其帚、化为竹林',
  'あや、あややや……',
  '阿姨压一压～一压～一～～',
  '弟啊，给我来一杯八心八箭的西行寺幽灵红茶',
  '大小姐：我扼住了命运的喉咙，但命运却砸平了我的胸',
  'get☆down',
  '我们遇到什么击破撞，也不要怕，削除击破撞的最好方法就是击破之前撞，疮痍，就是胜利，加油，奥利给！',
  '如是耶？',
  '草莓教授拿出四次元阳电子炸弹时，千百合举起了折凳',
  '有罪！',
  '（一种植物）',
  'TM折凳的力量！！',
  '反魂蝶舞',
  '铃瑚：真正的烤团子、可带劲了，让你吃到真正的石灰，不一样的滋味！',
  '你看这个毛玉中暑了，不如我们……',
  '我们受过严格的训练，无论多好笑，也不会笑（除非忍不住）',
  '秘封俱乐部由莲子和蕾蒂组成',
  '打则死路一条',
  '上海爱丽丝弦乐团里的天狗梅蒂馨',
  'Wwwwwwwww',
  '红魔馆又双叒叕爆炸啦~~',
  '红魔馆财政危机',
  '世界美咲剧场',
  'biu~biu~biubiubiubiubiu~~~',
  '19在三途川里游泳',
  '牛姐养的是皇带鱼，学到了',
  '帝出乎震，齊乎巽，相見乎離，致役乎坤，說言乎兌，戰乎乾，勞乎坎，成言乎艮。',
  'Cheeeeeeeeeeeeeen!!!',
  '每年因寿命论而死的咲夜连起来可绕地球两圈',
  '禁止迫害厄神',
]

export default yiyan
