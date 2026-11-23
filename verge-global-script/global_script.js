/***
 * Clash Verge Rev / Mihomo Party 优化脚本
 * 原作者: dahaha-365 (YaNet)
 * Github：https://github.com/dahaha-365/YaNet
 */

function stringToArray(val) {
  if (Array.isArray(val)) return val
  if (typeof val !== 'string') return []
  return val
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

// --- 1. 静态配置区域 ---

const _skipIps =
  '10.0.0.0/8;100.64.0.0/10;127.0.0.0/8;169.254.0.0/16;172.16.0.0/12;192.168.0.0/16;198.18.0.0/16;FC00::/7;FE80::/10;::1/128'

// DNS 配置
const _chinaDohDns = 'https://doh.pub/dns-query;https://dns.alidns.com/dns-query'
const _foreignDohDns = 'https://dns.google/dns-query;https://dns.adguard-dns.com/dns-query'
const _chinaIpDns = '119.29.29.29;223.5.5.5'
const _foreignIpDns = '8.8.8.8;94.140.14.14'

// --- dedione 订阅拦截规则（迁移自 dedione profile；目标组由本脚本统一为「拒绝」）---
const _dedioneAds = [
  "DOMAIN-KEYWORD,admarvel",
  "DOMAIN-KEYWORD,admaster",
  "DOMAIN-KEYWORD,adsage",
  "DOMAIN-KEYWORD,adsensor",
  "DOMAIN-KEYWORD,adsmogo",
  "DOMAIN-KEYWORD,adsrvmedia",
  "DOMAIN-KEYWORD,adsserving",
  "DOMAIN-KEYWORD,adsystem",
  "DOMAIN-KEYWORD,adwords",
  "DOMAIN-KEYWORD,applovin",
  "DOMAIN-KEYWORD,appsflyer",
  "DOMAIN-KEYWORD,domob",
  "DOMAIN-KEYWORD,duomeng",
  "DOMAIN-KEYWORD,dwtrack",
  "DOMAIN-KEYWORD,guanggao",
  "DOMAIN-KEYWORD,omgmta",
  "DOMAIN-KEYWORD,omniture",
  "DOMAIN-KEYWORD,openx",
  "DOMAIN-KEYWORD,partnerad",
  "DOMAIN-KEYWORD,pingfore",
  "DOMAIN-KEYWORD,socdm",
  "DOMAIN-KEYWORD,supersonicads",
  "DOMAIN-KEYWORD,wlmonitor",
  "DOMAIN-KEYWORD,zjtoolbar",
  "DOMAIN-SUFFIX,09mk.cn",
  "DOMAIN-SUFFIX,100peng.com",
  "DOMAIN-SUFFIX,114la.com",
  "DOMAIN-SUFFIX,123juzi.net",
  "DOMAIN-SUFFIX,138lm.com",
  "DOMAIN-SUFFIX,17un.com",
  "DOMAIN-SUFFIX,2cnt.net",
  "DOMAIN-SUFFIX,3gmimo.com",
  "DOMAIN-SUFFIX,3xx.vip",
  "DOMAIN-SUFFIX,51.la",
  "DOMAIN-SUFFIX,51taifu.com",
  "DOMAIN-SUFFIX,51yes.com",
  "DOMAIN-SUFFIX,600ad.com",
  "DOMAIN-SUFFIX,6dad.com",
  "DOMAIN-SUFFIX,70e.com",
  "DOMAIN-SUFFIX,86.cc",
  "DOMAIN-SUFFIX,8le8le.com",
  "DOMAIN-SUFFIX,8ox.cn",
  "DOMAIN-SUFFIX,95558000.com",
  "DOMAIN-SUFFIX,99click.com",
  "DOMAIN-SUFFIX,99youmeng.com",
  "DOMAIN-SUFFIX,a3p4.net",
  "DOMAIN-SUFFIX,acs86.com",
  "DOMAIN-SUFFIX,acxiom-online.com",
  "DOMAIN-SUFFIX,ad-brix.com",
  "DOMAIN-SUFFIX,ad-delivery.net",
  "DOMAIN-SUFFIX,ad-locus.com",
  "DOMAIN-SUFFIX,ad-plus.cn",
  "DOMAIN-SUFFIX,ad7.com",
  "DOMAIN-SUFFIX,adadapted.com",
  "DOMAIN-SUFFIX,adadvisor.net",
  "DOMAIN-SUFFIX,adap.tv",
  "DOMAIN-SUFFIX,adbana.com",
  "DOMAIN-SUFFIX,adchina.com",
  "DOMAIN-SUFFIX,adcome.cn",
  "DOMAIN-SUFFIX,ader.mobi",
  "DOMAIN-SUFFIX,adform.net",
  "DOMAIN-SUFFIX,adfuture.cn",
  "DOMAIN-SUFFIX,adhouyi.com",
  "DOMAIN-SUFFIX,adinfuse.com",
  "DOMAIN-SUFFIX,adirects.com",
  "DOMAIN-SUFFIX,adjust.io",
  "DOMAIN-SUFFIX,adkmob.com",
  "DOMAIN-SUFFIX,adlive.cn",
  "DOMAIN-SUFFIX,adlocus.com",
  "DOMAIN-SUFFIX,admaji.com",
  "DOMAIN-SUFFIX,admin6.com",
  "DOMAIN-SUFFIX,admon.cn",
  "DOMAIN-SUFFIX,adnyg.com",
  "DOMAIN-SUFFIX,adpolestar.net",
  "DOMAIN-SUFFIX,adpro.cn",
  "DOMAIN-SUFFIX,adpush.cn",
  "DOMAIN-SUFFIX,adquan.com",
  "DOMAIN-SUFFIX,adreal.cn",
  "DOMAIN-SUFFIX,ads8.com",
  "DOMAIN-SUFFIX,adsame.com",
  "DOMAIN-SUFFIX,adsmogo.com",
  "DOMAIN-SUFFIX,adsmogo.org",
  "DOMAIN-SUFFIX,adsunflower.com",
  "DOMAIN-SUFFIX,adsunion.com",
  "DOMAIN-SUFFIX,adtrk.me",
  "DOMAIN-SUFFIX,adups.com",
  "DOMAIN-SUFFIX,aduu.cn",
  "DOMAIN-SUFFIX,advertising.com",
  "DOMAIN-SUFFIX,adview.cn",
  "DOMAIN-SUFFIX,advmob.cn",
  "DOMAIN-SUFFIX,adwetec.com",
  "DOMAIN-SUFFIX,adwhirl.com",
  "DOMAIN-SUFFIX,adwo.com",
  "DOMAIN-SUFFIX,adxmi.com",
  "DOMAIN-SUFFIX,adyun.com",
  "DOMAIN-SUFFIX,adzerk.net",
  "DOMAIN-SUFFIX,agrant.cn",
  "DOMAIN-SUFFIX,agrantsem.com",
  "DOMAIN-SUFFIX,aihaoduo.cn",
  "DOMAIN-SUFFIX,ajapk.com",
  "DOMAIN-SUFFIX,allyes.cn",
  "DOMAIN-SUFFIX,allyes.com",
  "DOMAIN-SUFFIX,amazon-adsystem.com",
  "DOMAIN-SUFFIX,analysys.cn",
  "DOMAIN-SUFFIX,angsrvr.com",
  "DOMAIN-SUFFIX,anquan.org",
  "DOMAIN-SUFFIX,anysdk.com",
  "DOMAIN-SUFFIX,appadhoc.com",
  "DOMAIN-SUFFIX,appads.com",
  "DOMAIN-SUFFIX,appboy.com",
  "DOMAIN-SUFFIX,appdriver.cn",
  "DOMAIN-SUFFIX,appjiagu.com",
  "DOMAIN-SUFFIX,applifier.com",
  "DOMAIN-SUFFIX,appsflyer.com",
  "DOMAIN-SUFFIX,atdmt.com",
  "DOMAIN-SUFFIX,baifendian.com",
  "DOMAIN-SUFFIX,banmamedia.com",
  "DOMAIN-SUFFIX,baoyatu.cc",
  "DOMAIN-SUFFIX,baycode.cn",
  "DOMAIN-SUFFIX,bayimob.com",
  "DOMAIN-SUFFIX,behe.com",
  "DOMAIN-SUFFIX,bfshan.cn",
  "DOMAIN-SUFFIX,biddingos.com",
  "DOMAIN-SUFFIX,biddingx.com",
  "DOMAIN-SUFFIX,bjvvqu.cn",
  "DOMAIN-SUFFIX,bjxiaohua.com",
  "DOMAIN-SUFFIX,bloggerads.net",
  "DOMAIN-SUFFIX,branch.io",
  "DOMAIN-SUFFIX,bsdev.cn",
  "DOMAIN-SUFFIX,bshare.cn",
  "DOMAIN-SUFFIX,btyou.com",
  "DOMAIN-SUFFIX,bugtags.com",
  "DOMAIN-SUFFIX,buysellads.com",
  "DOMAIN-SUFFIX,c0563.com",
  "DOMAIN-SUFFIX,cacafly.com",
  "DOMAIN-SUFFIX,casee.cn",
  "DOMAIN-SUFFIX,cdnmaster.com",
  "DOMAIN-SUFFIX,chance-ad.com",
  "DOMAIN-SUFFIX,chanet.com.cn",
  "DOMAIN-SUFFIX,chartbeat.com",
  "DOMAIN-SUFFIX,chartboost.com",
  "DOMAIN-SUFFIX,chengadx.com",
  "DOMAIN-SUFFIX,chmae.com",
  "DOMAIN-SUFFIX,clickadu.com",
  "DOMAIN-SUFFIX,clicki.cn",
  "DOMAIN-SUFFIX,clicktracks.com",
  "DOMAIN-SUFFIX,clickzs.com",
  "DOMAIN-SUFFIX,cloudmobi.net",
  "DOMAIN-SUFFIX,cmcore.com",
  "DOMAIN-SUFFIX,cnxad.com",
  "DOMAIN-SUFFIX,cnzz.com",
  "DOMAIN-SUFFIX,cnzzlink.com",
  "DOMAIN-SUFFIX,cocounion.com",
  "DOMAIN-SUFFIX,coocaatv.com",
  "DOMAIN-SUFFIX,cooguo.com",
  "DOMAIN-SUFFIX,coolguang.com",
  "DOMAIN-SUFFIX,coremetrics.com",
  "DOMAIN-SUFFIX,cpmchina.co",
  "DOMAIN-SUFFIX,cpx24.com",
  "DOMAIN-SUFFIX,crasheye.cn",
  "DOMAIN-SUFFIX,crosschannel.com",
  "DOMAIN-SUFFIX,ctrmi.com",
  "DOMAIN-SUFFIX,customer-security.online",
  "DOMAIN-SUFFIX,daoyoudao.com",
  "DOMAIN-SUFFIX,datouniao.com",
  "DOMAIN-SUFFIX,ddapp.cn",
  "DOMAIN-SUFFIX,dianjoy.com",
  "DOMAIN-SUFFIX,dianru.com",
  "DOMAIN-SUFFIX,disqusads.com",
  "DOMAIN-SUFFIX,domob.cn",
  "DOMAIN-SUFFIX,domob.com.cn",
  "DOMAIN-SUFFIX,domob.org",
  "DOMAIN-SUFFIX,dotmore.com.tw",
  "DOMAIN-SUFFIX,doubleverify.com",
  "DOMAIN-SUFFIX,doudouguo.com",
  "DOMAIN-SUFFIX,doumob.com",
  "DOMAIN-SUFFIX,duanat.com",
  "DOMAIN-SUFFIX,duiba.com.cn",
  "DOMAIN-SUFFIX,duomeng.cn",
  "DOMAIN-SUFFIX,dxpmedia.com",
  "DOMAIN-SUFFIX,edigitalsurvey.com",
  "DOMAIN-SUFFIX,eduancm.com",
  "DOMAIN-SUFFIX,emarbox.com",
  "DOMAIN-SUFFIX,exosrv.com",
  "DOMAIN-SUFFIX,fancyapi.com",
  "DOMAIN-SUFFIX,feitian001.com",
  "DOMAIN-SUFFIX,feixin2.com",
  "DOMAIN-SUFFIX,flashtalking.com",
  "DOMAIN-SUFFIX,fraudmetrix.cn",
  "DOMAIN-SUFFIX,g1.tagtic.cn",
  "DOMAIN-SUFFIX,gentags.net",
  "DOMAIN-SUFFIX,gepush.com",
  "DOMAIN-SUFFIX,getui.com",
  "DOMAIN-SUFFIX,glispa.com",
  "DOMAIN-SUFFIX,go-mpulse",
  "DOMAIN-SUFFIX,go-mpulse.net",
  "DOMAIN-SUFFIX,godloveme.cn",
  "DOMAIN-SUFFIX,gridsum.com",
  "DOMAIN-SUFFIX,gridsumdissector.cn",
  "DOMAIN-SUFFIX,gridsumdissector.com",
  "DOMAIN-SUFFIX,growingio.com",
  "DOMAIN-SUFFIX,guohead.com",
  "DOMAIN-SUFFIX,guomob.com",
  "DOMAIN-SUFFIX,haoghost.com",
  "DOMAIN-SUFFIX,hivecn.cn",
  "DOMAIN-SUFFIX,hypers.com",
  "DOMAIN-SUFFIX,icast.cn",
  "DOMAIN-SUFFIX,igexin.com",
  "DOMAIN-SUFFIX,il8r.com",
  "DOMAIN-SUFFIX,imageter.com",
  "DOMAIN-SUFFIX,immob.cn",
  "DOMAIN-SUFFIX,inad.com",
  "DOMAIN-SUFFIX,inmobi.cn",
  "DOMAIN-SUFFIX,inmobi.net",
  "DOMAIN-SUFFIX,inmobicdn.cn",
  "DOMAIN-SUFFIX,inmobicdn.net",
  "DOMAIN-SUFFIX,innity.com",
  "DOMAIN-SUFFIX,instabug.com",
  "DOMAIN-SUFFIX,intely.cn",
  "DOMAIN-SUFFIX,iperceptions.com",
  "DOMAIN-SUFFIX,ipinyou.com",
  "DOMAIN-SUFFIX,irs01.com",
  "DOMAIN-SUFFIX,irs01.net",
  "DOMAIN-SUFFIX,irs09.com",
  "DOMAIN-SUFFIX,istreamsche.com",
  "DOMAIN-SUFFIX,jesgoo.com",
  "DOMAIN-SUFFIX,jiaeasy.net",
  "DOMAIN-SUFFIX,jiguang.cn",
  "DOMAIN-SUFFIX,jimdo.com",
  "DOMAIN-SUFFIX,jisucn.com",
  "DOMAIN-SUFFIX,jmgehn.cn",
  "DOMAIN-SUFFIX,jpush.cn",
  "DOMAIN-SUFFIX,jusha.com",
  "DOMAIN-SUFFIX,juzi.cn",
  "DOMAIN-SUFFIX,juzilm.com",
  "DOMAIN-SUFFIX,kejet.com",
  "DOMAIN-SUFFIX,kejet.net",
  "DOMAIN-SUFFIX,keydot.net",
  "DOMAIN-SUFFIX,keyrun.cn",
  "DOMAIN-SUFFIX,kmd365.com",
  "DOMAIN-SUFFIX,krux.net",
  "DOMAIN-SUFFIX,lnk0.com",
  "DOMAIN-SUFFIX,lnk8.cn",
  "DOMAIN-SUFFIX,localytics.com",
  "DOMAIN-SUFFIX,lomark.cn",
  "DOMAIN-SUFFIX,lotuseed.com",
  "DOMAIN-SUFFIX,lrswl.com",
  "DOMAIN-SUFFIX,lufax.com",
  "DOMAIN-SUFFIX,madhouse.cn",
  "DOMAIN-SUFFIX,madmini.com",
  "DOMAIN-SUFFIX,madserving.com",
  "DOMAIN-SUFFIX,magicwindow.cn",
  "DOMAIN-SUFFIX,mathtag.com",
  "DOMAIN-SUFFIX,maysunmedia.com",
  "DOMAIN-SUFFIX,mbai.cn",
  "DOMAIN-SUFFIX,mediaplex.com",
  "DOMAIN-SUFFIX,mediav.com",
  "DOMAIN-SUFFIX,megajoy.com",
  "DOMAIN-SUFFIX,mgogo.com",
  "DOMAIN-SUFFIX,miaozhen.com",
  "DOMAIN-SUFFIX,microad-cn.com",
  "DOMAIN-SUFFIX,miidi.net",
  "DOMAIN-SUFFIX,mijifen.com",
  "DOMAIN-SUFFIX,mixpanel.com",
  "DOMAIN-SUFFIX,mjmobi.com",
  "DOMAIN-SUFFIX,mng-ads.com",
  "DOMAIN-SUFFIX,moad.cn",
  "DOMAIN-SUFFIX,moatads.com",
  "DOMAIN-SUFFIX,mobaders.com",
  "DOMAIN-SUFFIX,mobclix.com",
  "DOMAIN-SUFFIX,mobgi.com",
  "DOMAIN-SUFFIX,mobisage.cn",
  "DOMAIN-SUFFIX,mobvista.com",
  "DOMAIN-SUFFIX,moogos.com",
  "DOMAIN-SUFFIX,mopub.com",
  "DOMAIN-SUFFIX,moquanad.com",
  "DOMAIN-SUFFIX,mpush.cn",
  "DOMAIN-SUFFIX,mxpnl.com",
  "DOMAIN-SUFFIX,myhug.cn",
  "DOMAIN-SUFFIX,mzy2014.com",
  "DOMAIN-SUFFIX,networkbench.com",
  "DOMAIN-SUFFIX,ninebox.cn",
  "DOMAIN-SUFFIX,ntalker.com",
  "DOMAIN-SUFFIX,nylalobghyhirgh.com",
  "DOMAIN-SUFFIX,o2omobi.com",
  "DOMAIN-SUFFIX,oadz.com",
  "DOMAIN-SUFFIX,oneapm.com",
  "DOMAIN-SUFFIX,onetad.com",
  "DOMAIN-SUFFIX,optaim.com",
  "DOMAIN-SUFFIX,optimix.asia",
  "DOMAIN-SUFFIX,optimix.cn",
  "DOMAIN-SUFFIX,optimizelyapis.com",
  "DOMAIN-SUFFIX,overture.com",
  "DOMAIN-SUFFIX,p0y.cn",
  "DOMAIN-SUFFIX,pagechoice.net",
  "DOMAIN-SUFFIX,pingdom.net",
  "DOMAIN-SUFFIX,plugrush.com",
  "DOMAIN-SUFFIX,popin.cc",
  "DOMAIN-SUFFIX,pro.cn",
  "DOMAIN-SUFFIX,publicidad.net",
  "DOMAIN-SUFFIX,publicidad.tv",
  "DOMAIN-SUFFIX,pubmatic.com",
  "DOMAIN-SUFFIX,pubnub.com",
  "DOMAIN-SUFFIX,qcl777.com",
  "DOMAIN-SUFFIX,qiyou.com",
  "DOMAIN-SUFFIX,qtmojo.com",
  "DOMAIN-SUFFIX,quantcount.com",
  "DOMAIN-SUFFIX,qucaigg.com",
  "DOMAIN-SUFFIX,qumi.com",
  "DOMAIN-SUFFIX,qxxys.com",
  "DOMAIN-SUFFIX,reachmax.cn",
  "DOMAIN-SUFFIX,responsys.net",
  "DOMAIN-SUFFIX,revsci.net",
  "DOMAIN-SUFFIX,rlcdn.com",
  "DOMAIN-SUFFIX,rtbasia.com",
  "DOMAIN-SUFFIX,sanya1.com",
  "DOMAIN-SUFFIX,scupio.com",
  "DOMAIN-SUFFIX,serving-sys.com",
  "DOMAIN-SUFFIX,shuiguo.com",
  "DOMAIN-SUFFIX,shuzilm.cn",
  "DOMAIN-SUFFIX,similarweb.com",
  "DOMAIN-SUFFIX,sitemeter.com",
  "DOMAIN-SUFFIX,sitescout.com",
  "DOMAIN-SUFFIX,sitetag.us",
  "DOMAIN-SUFFIX,smartmad.com",
  "DOMAIN-SUFFIX,social-touch.com",
  "DOMAIN-SUFFIX,somecoding.com",
  "DOMAIN-SUFFIX,sponsorpay.com",
  "DOMAIN-SUFFIX,stargame.com",
  "DOMAIN-SUFFIX,stg8.com",
  "DOMAIN-SUFFIX,switchadhub.com",
  "DOMAIN-SUFFIX,sycbbs.com",
  "DOMAIN-SUFFIX,synacast.com",
  "DOMAIN-SUFFIX,sysdig.com",
  "DOMAIN-SUFFIX,talkingdata.com",
  "DOMAIN-SUFFIX,talkingdata.net",
  "DOMAIN-SUFFIX,tansuotv.com",
  "DOMAIN-SUFFIX,tanv.com",
  "DOMAIN-SUFFIX,tanx.com",
  "DOMAIN-SUFFIX,tapjoy.cn",
  "DOMAIN-SUFFIX,th7.cn",
  "DOMAIN-SUFFIX,thoughtleadr.com",
  "DOMAIN-SUFFIX,tianmidian.com",
  "DOMAIN-SUFFIX,tiqcdn.com",
  "DOMAIN-SUFFIX,touclick.com",
  "DOMAIN-SUFFIX,trafficjam.cn",
  "DOMAIN-SUFFIX,trafficmp.com",
  "DOMAIN-SUFFIX,tuia.cn",
  "DOMAIN-SUFFIX,ueadlian.com",
  "DOMAIN-SUFFIX,uerzyr.cn",
  "DOMAIN-SUFFIX,ugdtimg.com",
  "DOMAIN-SUFFIX,ugvip.com",
  "DOMAIN-SUFFIX,ujian.cc",
  "DOMAIN-SUFFIX,ukeiae.com",
  "DOMAIN-SUFFIX,umeng.co",
  "DOMAIN-SUFFIX,umeng.com",
  "DOMAIN-SUFFIX,umtrack.com",
  "DOMAIN-SUFFIX,unimhk.com",
  "DOMAIN-SUFFIX,union-wifi.com",
  "DOMAIN-SUFFIX,union001.com",
  "DOMAIN-SUFFIX,unionsy.com",
  "DOMAIN-SUFFIX,unlitui.com",
  "DOMAIN-SUFFIX,uri6.com",
  "DOMAIN-SUFFIX,ushaqi.com",
  "DOMAIN-SUFFIX,usingde.com",
  "DOMAIN-SUFFIX,uuzu.com",
  "DOMAIN-SUFFIX,uyunad.com",
  "DOMAIN-SUFFIX,vamaker.com",
  "DOMAIN-SUFFIX,vlion.cn",
  "DOMAIN-SUFFIX,voiceads.cn",
  "DOMAIN-SUFFIX,voiceads.com",
  "DOMAIN-SUFFIX,vpon.com",
  "DOMAIN-SUFFIX,vungle.cn",
  "DOMAIN-SUFFIX,vungle.com",
  "DOMAIN-SUFFIX,waps.cn",
  "DOMAIN-SUFFIX,wapx.cn",
  "DOMAIN-SUFFIX,webterren.com",
  "DOMAIN-SUFFIX,whpxy.com",
  "DOMAIN-SUFFIX,winads.cn",
  "DOMAIN-SUFFIX,winasdaq.com",
  "DOMAIN-SUFFIX,wiyun.com",
  "DOMAIN-SUFFIX,wooboo.com.cn",
  "DOMAIN-SUFFIX,wqmobile.com",
  "DOMAIN-SUFFIX,wrating.com",
  "DOMAIN-SUFFIX,wumii.cn",
  "DOMAIN-SUFFIX,xcy8.com",
  "DOMAIN-SUFFIX,xdrig.com",
  "DOMAIN-SUFFIX,xiaozhen.com",
  "DOMAIN-SUFFIX,xibao100.com",
  "DOMAIN-SUFFIX,xtgreat.com",
  // 2026-11-22 移除 xy.com：整域后缀过宽（会挡掉所有 *.xy.com），且与
  // blackmatrix7 WeChat 集的 weixinsxy.com 有前缀混淆风险。来源名单无法确认
  // 其广告语义，宁放行不误杀。
  "DOMAIN-SUFFIX,yandui.com",
  "DOMAIN-SUFFIX,yigao.com",
  "DOMAIN-SUFFIX,yijifen.com",
  "DOMAIN-SUFFIX,yinooo.com",
  "DOMAIN-SUFFIX,yiqifa.com",
  "DOMAIN-SUFFIX,yiwk.com",
  "DOMAIN-SUFFIX,ylunion.com",
  "DOMAIN-SUFFIX,ymapp.com",
  "DOMAIN-SUFFIX,ymcdn.cn",
  "DOMAIN-SUFFIX,yongyuelm.com",
  "DOMAIN-SUFFIX,yooli.com",
  "DOMAIN-SUFFIX,youmi.net",
  "DOMAIN-SUFFIX,youxiaoad.com",
  "DOMAIN-SUFFIX,yoyi.com.cn",
  "DOMAIN-SUFFIX,yoyi.tv",
  "DOMAIN-SUFFIX,yrxmr.com",
  "DOMAIN-SUFFIX,ysjwj.com",
  "DOMAIN-SUFFIX,yunjiasu.com",
  "DOMAIN-SUFFIX,yunpifu.cn",
  "DOMAIN-SUFFIX,zampdsp.com",
  "DOMAIN-SUFFIX,zamplus.com",
  "DOMAIN-SUFFIX,zcdsp.com",
  "DOMAIN-SUFFIX,zhidian3g.cn",
  "DOMAIN-SUFFIX,zhiziyun.com",
  "DOMAIN-SUFFIX,zhjfad.com",
  "DOMAIN-SUFFIX,zqzxz.com",
  "DOMAIN-SUFFIX,zzsx8.com",
  "DOMAIN-SUFFIX,wwads.cn",
  "DOMAIN-SUFFIX,acuityplatform.com",
  "DOMAIN-SUFFIX,ad-stir.com",
  "DOMAIN-SUFFIX,ad-survey.com",
  "DOMAIN-SUFFIX,ad4game.com",
  "DOMAIN-SUFFIX,adcloud.jp",
  "DOMAIN-SUFFIX,adcolony.com",
  "DOMAIN-SUFFIX,addthis.com",
  "DOMAIN-SUFFIX,adfurikun.jp",
  "DOMAIN-SUFFIX,adhigh.net",
  "DOMAIN-SUFFIX,adhood.com",
  "DOMAIN-SUFFIX,adinall.com",
  "DOMAIN-SUFFIX,adition.com",
  "DOMAIN-SUFFIX,adk2x.com",
  "DOMAIN-SUFFIX,admarket.mobi",
  "DOMAIN-SUFFIX,admarvel.com",
  "DOMAIN-SUFFIX,admedia.com",
  "DOMAIN-SUFFIX,adnxs.com",
  "DOMAIN-SUFFIX,adotmob.com",
  "DOMAIN-SUFFIX,adperium.com",
  "DOMAIN-SUFFIX,adriver.ru",
  "DOMAIN-SUFFIX,adroll.com",
  "DOMAIN-SUFFIX,adsco.re",
  "DOMAIN-SUFFIX,adservice.com",
  "DOMAIN-SUFFIX,adsrvr.org",
  "DOMAIN-SUFFIX,adsymptotic.com",
  "DOMAIN-SUFFIX,adtaily.com",
  "DOMAIN-SUFFIX,adtech.de",
  "DOMAIN-SUFFIX,adtechjp.com",
  "DOMAIN-SUFFIX,adtechus.com",
  "DOMAIN-SUFFIX,airpush.com",
  "DOMAIN-SUFFIX,am15.net",
  "DOMAIN-SUFFIX,amobee.com",
  "DOMAIN-SUFFIX,appier.net",
  "DOMAIN-SUFFIX,applift.com",
  "DOMAIN-SUFFIX,apsalar.com",
  "DOMAIN-SUFFIX,atas.io",
  "DOMAIN-SUFFIX,awempire.com",
  "DOMAIN-SUFFIX,axonix.com",
  "DOMAIN-SUFFIX,beintoo.com",
  "DOMAIN-SUFFIX,bepolite.eu",
  "DOMAIN-SUFFIX,bidtheatre.com",
  "DOMAIN-SUFFIX,bidvertiser.com",
  "DOMAIN-SUFFIX,blismedia.com",
  "DOMAIN-SUFFIX,brucelead.com",
  "DOMAIN-SUFFIX,bttrack.com",
  "DOMAIN-SUFFIX,casalemedia.com",
  "DOMAIN-SUFFIX,celtra.com",
  "DOMAIN-SUFFIX,channeladvisor.com",
  "DOMAIN-SUFFIX,connexity.net",
  "DOMAIN-SUFFIX,criteo.com",
  "DOMAIN-SUFFIX,criteo.net",
  "DOMAIN-SUFFIX,csbew.com",
  "DOMAIN-SUFFIX,directrev.com",
  "DOMAIN-SUFFIX,dumedia.ru",
  "DOMAIN-SUFFIX,effectivemeasure.com",
  "DOMAIN-SUFFIX,effectivemeasure.net",
  "DOMAIN-SUFFIX,eqads.com",
  "DOMAIN-SUFFIX,everesttech.net",
  "DOMAIN-SUFFIX,exoclick.com",
  "DOMAIN-SUFFIX,extend.tv",
  "DOMAIN-SUFFIX,eyereturn.com",
  "DOMAIN-SUFFIX,fastapi.net",
  "DOMAIN-SUFFIX,fastclick.com",
  "DOMAIN-SUFFIX,fastclick.net",
  "DOMAIN-SUFFIX,flurry.com",
  "DOMAIN-SUFFIX,gosquared.com",
  "DOMAIN-SUFFIX,gtags.net",
  "DOMAIN-SUFFIX,heyzap.com",
  "DOMAIN-SUFFIX,histats.com",
  "DOMAIN-SUFFIX,hitslink.com",
  "DOMAIN-SUFFIX,hot-mob.com",
  "DOMAIN-SUFFIX,hyperpromote.com",
  "DOMAIN-SUFFIX,i-mobile.co.jp",
  "DOMAIN-SUFFIX,imrworldwide.com",
  "DOMAIN-SUFFIX,inmobi.com",
  "DOMAIN-SUFFIX,inner-active.mobi",
  "DOMAIN-SUFFIX,intentiq.com",
  "DOMAIN-SUFFIX,inter1ads.com",
  "DOMAIN-SUFFIX,ipredictive.com",
  "DOMAIN-SUFFIX,ironsrc.com",
  "DOMAIN-SUFFIX,iskyworker.com",
  "DOMAIN-SUFFIX,jizzads.com",
  "DOMAIN-SUFFIX,juicyads.com",
  "DOMAIN-SUFFIX,kochava.com",
  "DOMAIN-SUFFIX,leadbolt.com",
  "DOMAIN-SUFFIX,leadbolt.net",
  "DOMAIN-SUFFIX,leadboltads.net",
  "DOMAIN-SUFFIX,leadboltapps.net",
  "DOMAIN-SUFFIX,leadboltmobile.net",
  "DOMAIN-SUFFIX,lenzmx.com",
  "DOMAIN-SUFFIX,liveadvert.com",
  "DOMAIN-SUFFIX,marketgid.com",
  "DOMAIN-SUFFIX,marketo.com",
  "DOMAIN-SUFFIX,mdotm.com",
  "DOMAIN-SUFFIX,medialytics.com",
  "DOMAIN-SUFFIX,medialytics.io",
  "DOMAIN-SUFFIX,meetrics.com",
  "DOMAIN-SUFFIX,meetrics.net",
  "DOMAIN-SUFFIX,mgid.com",
  "DOMAIN-SUFFIX,millennialmedia.com",
  "DOMAIN-SUFFIX,mobadme.jp",
  "DOMAIN-SUFFIX,mobfox.com",
  "DOMAIN-SUFFIX,mobileadtrading.com",
  "DOMAIN-SUFFIX,mobilityware.com",
  "DOMAIN-SUFFIX,mojiva.com",
  "DOMAIN-SUFFIX,mookie1.com",
  "DOMAIN-SUFFIX,msads.net",
  "DOMAIN-SUFFIX,mydas.mobi",
  "DOMAIN-SUFFIX,nend.net",
  "DOMAIN-SUFFIX,netshelter.net",
  "DOMAIN-SUFFIX,nexage.com",
  "DOMAIN-SUFFIX,owneriq.net",
  "DOMAIN-SUFFIX,pixels.asia",
  "DOMAIN-SUFFIX,plista.com",
  "DOMAIN-SUFFIX,popads.net",
  "DOMAIN-SUFFIX,powerlinks.com",
  "DOMAIN-SUFFIX,propellerads.com",
  "DOMAIN-SUFFIX,quantserve.com",
  "DOMAIN-SUFFIX,rayjump.com",
  "DOMAIN-SUFFIX,revdepo.com",
  "DOMAIN-SUFFIX,rubiconproject.com",
  "DOMAIN-SUFFIX,sape.ru",
  "DOMAIN-SUFFIX,scorecardresearch.com",
  "DOMAIN-SUFFIX,segment.com",
  "DOMAIN-SUFFIX,serving-sys.com",
  "DOMAIN-SUFFIX,sharethis.com",
  "DOMAIN-SUFFIX,smaato.com",
  "DOMAIN-SUFFIX,smaato.net",
  "DOMAIN-SUFFIX,smartadserver.com",
  "DOMAIN-SUFFIX,smartnews-ads.com",
  "DOMAIN-SUFFIX,startapp.com",
  "DOMAIN-SUFFIX,startappexchange.com",
  "DOMAIN-SUFFIX,statcounter.com",
  "DOMAIN-SUFFIX,steelhousemedia.com",
  "DOMAIN-SUFFIX,stickyadstv.com",
  "DOMAIN-SUFFIX,supersonic.com",
  "DOMAIN-SUFFIX,taboola.com",
  "DOMAIN-SUFFIX,tapjoy.com",
  "DOMAIN-SUFFIX,tapjoyads.com",
  "DOMAIN-SUFFIX,trafficjunky.com",
  "DOMAIN-SUFFIX,trafficjunky.net",
  "DOMAIN-SUFFIX,tribalfusion.com",
  "DOMAIN-SUFFIX,turn.com",
  "DOMAIN-SUFFIX,uberads.com",
  "DOMAIN-SUFFIX,vidoomy.com",
  "DOMAIN-SUFFIX,viglink.com",
  "DOMAIN-SUFFIX,voicefive.com",
  "DOMAIN-SUFFIX,wedolook.com",
  "DOMAIN-SUFFIX,yadro.ru",
  "DOMAIN-SUFFIX,yengo.com",
  "DOMAIN-SUFFIX,zedo.com",
  "DOMAIN-SUFFIX,zemanta.com",
  "DOMAIN-SUFFIX,11h5.com",
  "DOMAIN-SUFFIX,1kxun.mobi",
  "DOMAIN-SUFFIX,26zsd.cn",
  "DOMAIN-SUFFIX,519397.com",
  "DOMAIN-SUFFIX,626uc.com",
  "DOMAIN-SUFFIX,915.com",
  "DOMAIN-SUFFIX,appget.cn",
  "DOMAIN-SUFFIX,appuu.cn",
  "DOMAIN-SUFFIX,coinhive.com",
  "DOMAIN-SUFFIX,huodonghezi.cn",
  "DOMAIN-SUFFIX,vcbn65.xyz",
  "DOMAIN-SUFFIX,wanfeng1.com",
  "DOMAIN-SUFFIX,wep016.top",
  "DOMAIN-SUFFIX,win-stock.com.cn",
  "DOMAIN-SUFFIX,zantainet.com",
  "DOMAIN-SUFFIX,dh54wf.xyz",
  "DOMAIN-SUFFIX,g2q3e.cn",
  "DOMAIN-SUFFIX,114so.cn",
  "DOMAIN-SUFFIX,go.10086.cn",
  "DOMAIN-SUFFIX,hivedata.cc",
  "DOMAIN-SUFFIX,navi.gd.chinamobile.com",
]

const _dedionePurify = [
  "DOMAIN-SUFFIX,a.youdao.com",
  "DOMAIN-SUFFIX,adgeo.corp.163.com",
  "DOMAIN-SUFFIX,analytics.126.net",
  "DOMAIN-SUFFIX,bobo.corp.163.com",
  "DOMAIN-SUFFIX,c.youdao.com",
  "DOMAIN-SUFFIX,clkservice.youdao.com",
  "DOMAIN-SUFFIX,conv.youdao.com",
  "DOMAIN-SUFFIX,dsp-impr2.youdao.com",
  "DOMAIN-SUFFIX,dsp.youdao.com",
  "DOMAIN-SUFFIX,fa.corp.163.com",
  "DOMAIN-SUFFIX,g.corp.163.com",
  "DOMAIN-SUFFIX,g1.corp.163.com",
  "DOMAIN-SUFFIX,gb.corp.163.com",
  "DOMAIN-SUFFIX,gorgon.youdao.com",
  "DOMAIN-SUFFIX,haitaoad.nosdn.127.net",
  "DOMAIN-SUFFIX,iadmatvideo.nosdn.127.net",
  "DOMAIN-SUFFIX,img1.126.net",
  "DOMAIN-SUFFIX,img2.126.net",
  "DOMAIN-SUFFIX,ir.mail.126.com",
  "DOMAIN-SUFFIX,ir.mail.yeah.net",
  "DOMAIN-SUFFIX,mimg.126.net",
  "DOMAIN-SUFFIX,nc004x.corp.youdao.com",
  "DOMAIN-SUFFIX,nc045x.corp.youdao.com",
  "DOMAIN-SUFFIX,nex.corp.163.com",
  "DOMAIN-SUFFIX,oimagea2.ydstatic.com",
  "DOMAIN-SUFFIX,pagechoice.net",
  "DOMAIN-SUFFIX,prom.gome.com.cn",
  "DOMAIN-SUFFIX,qchannel0d.cn",
  "DOMAIN-SUFFIX,qt002x.corp.youdao.com",
  "DOMAIN-SUFFIX,rlogs.youdao.com",
  "DOMAIN-SUFFIX,static.flv.uuzuonline.com",
  "DOMAIN-SUFFIX,tb060x.corp.youdao.com",
  "DOMAIN-SUFFIX,tb104x.corp.youdao.com",
  "DOMAIN-SUFFIX,union.youdao.com",
  "DOMAIN-SUFFIX,wanproxy.127.net",
  "DOMAIN-SUFFIX,ydpushserver.youdao.com",
  "DOMAIN-SUFFIX,cvda.17173.com",
  "DOMAIN-SUFFIX,imgapp.yeyou.com",
  "DOMAIN-SUFFIX,log1.17173.com",
  "DOMAIN-SUFFIX,s.17173cdn.com",
  "DOMAIN-SUFFIX,ue.yeyoucdn.com",
  "DOMAIN-SUFFIX,vda.17173.com",
  "DOMAIN-SUFFIX,analytics.wanmei.com",
  "DOMAIN-SUFFIX,gg.stargame.com",
  "DOMAIN-SUFFIX,dl.2345.cn",
  "DOMAIN-SUFFIX,download.2345.cn",
  "DOMAIN-SUFFIX,houtai.2345.cn",
  "DOMAIN-SUFFIX,jifen.2345.cn",
  "DOMAIN-SUFFIX,jifendownload.2345.cn",
  "DOMAIN-SUFFIX,minipage.2345.cn",
  "DOMAIN-SUFFIX,wan.2345.cn",
  "DOMAIN-SUFFIX,zhushou.2345.cn",
  "DOMAIN-SUFFIX,3600.com",
  "DOMAIN-SUFFIX,gamebox.360.cn",
  "DOMAIN-SUFFIX,jiagu.360.cn",
  "DOMAIN-SUFFIX,kuaikan.netmon.360safe.com",
  "DOMAIN-SUFFIX,leak.360.cn",
  "DOMAIN-SUFFIX,lianmeng.360.cn",
  "DOMAIN-SUFFIX,pub.se.360.cn",
  "DOMAIN-SUFFIX,s.so.360.cn",
  "DOMAIN-SUFFIX,shouji.360.cn",
  "DOMAIN-SUFFIX,soft.data.weather.360.cn",
  "DOMAIN-SUFFIX,stat.360safe.com",
  "DOMAIN-SUFFIX,stat.m.360.cn",
  "DOMAIN-SUFFIX,update.360safe.com",
  "DOMAIN-SUFFIX,wan.360.cn",
  "DOMAIN-SUFFIX,58.xgo.com.cn",
  "DOMAIN-SUFFIX,brandshow.58.com",
  "DOMAIN-SUFFIX,imp.xgo.com.cn",
  "DOMAIN-SUFFIX,jing.58.com",
  "DOMAIN-SUFFIX,stat.xgo.com.cn",
  "DOMAIN-SUFFIX,track.58.com",
  "DOMAIN-SUFFIX,tracklog.58.com",
  "DOMAIN-SUFFIX,acjs.aliyun.com",
  "DOMAIN-SUFFIX,adash-c.m.taobao.com",
  "DOMAIN-SUFFIX,adash-c.ut.taobao.com",
  "DOMAIN-SUFFIX,adashx4yt.m.taobao.com",
  "DOMAIN-SUFFIX,adashxgc.ut.taobao.com",
  "DOMAIN-SUFFIX,afp.alicdn.com",
  "DOMAIN-SUFFIX,ai.m.taobao.com",
  "DOMAIN-SUFFIX,alipaylog.com",
  "DOMAIN-SUFFIX,atanx.alicdn.com",
  "DOMAIN-SUFFIX,atanx2.alicdn.com",
  "DOMAIN-SUFFIX,fav.simba.taobao.com",
  "DOMAIN-SUFFIX,g.click.taobao.com",
  "DOMAIN-SUFFIX,g.tbcdn.cn",
  "DOMAIN-SUFFIX,gma.alicdn.com",
  "DOMAIN-SUFFIX,gtmsdd.alicdn.com",
  "DOMAIN-SUFFIX,hydra.alibaba.com",
  "DOMAIN-SUFFIX,m.simba.taobao.com",
  "DOMAIN-SUFFIX,pindao.huoban.taobao.com",
  "DOMAIN-SUFFIX,re.m.taobao.com",
  "DOMAIN-SUFFIX,redirect.simba.taobao.com",
  "DOMAIN-SUFFIX,rj.m.taobao.com",
  "DOMAIN-SUFFIX,sdkinit.taobao.com",
  "DOMAIN-SUFFIX,show.re.taobao.com",
  "DOMAIN-SUFFIX,simaba.m.taobao.com",
  "DOMAIN-SUFFIX,simaba.taobao.com",
  "DOMAIN-SUFFIX,srd.simba.taobao.com",
  "DOMAIN-SUFFIX,strip.taobaocdn.com",
  "DOMAIN-SUFFIX,tns.simba.taobao.com",
  "DOMAIN-SUFFIX,tyh.taobao.com",
  "DOMAIN-SUFFIX,userimg.qunar.com",
  "DOMAIN-SUFFIX,yiliao.hupan.com",
  "DOMAIN-SUFFIX,3dns-2.adobe.com",
  "DOMAIN-SUFFIX,3dns-3.adobe.com",
  "DOMAIN-SUFFIX,activate-sea.adobe.com",
  "DOMAIN-SUFFIX,activate-sjc0.adobe.com",
  "DOMAIN-SUFFIX,activate.adobe.com",
  "DOMAIN-SUFFIX,adobe-dns-2.adobe.com",
  "DOMAIN-SUFFIX,adobe-dns-3.adobe.com",
  "DOMAIN-SUFFIX,adobe-dns.adobe.com",
  "DOMAIN-SUFFIX,ereg.adobe.com",
  "DOMAIN-SUFFIX,geo2.adobe.com",
  "DOMAIN-SUFFIX,hl2rcv.adobe.com",
  "DOMAIN-SUFFIX,hlrcv.stage.adobe.com",
  "DOMAIN-SUFFIX,lm.licenses.adobe.com",
  "DOMAIN-SUFFIX,lmlicenses.wip4.adobe.com",
  "DOMAIN-SUFFIX,na1r.services.adobe.com",
  "DOMAIN-SUFFIX,na2m-pr.licenses.adobe.com",
  "DOMAIN-SUFFIX,practivate.adobe.com",
  "DOMAIN-SUFFIX,wip3.adobe.com",
  "DOMAIN-SUFFIX,wwis-dubc1-vip60.adobe.com",
  "DOMAIN-SUFFIX,adserver.unityads.unity3d.com",
  "DOMAIN-SUFFIX,33.autohome.com.cn",
  "DOMAIN-SUFFIX,adproxy.autohome.com.cn",
  "DOMAIN-SUFFIX,al.autohome.com.cn",
  "DOMAIN-SUFFIX,alert.autohome.com.cn",
  "DOMAIN-SUFFIX,applogapi.autohome.com.cn",
  "DOMAIN-SUFFIX,c.autohome.com.cn",
  "DOMAIN-SUFFIX,cmx.autohome.com.cn",
  "DOMAIN-SUFFIX,dspmnt.autohome.com.cn",
  "DOMAIN-SUFFIX,pcd.autohome.com.cn",
  "DOMAIN-SUFFIX,push.app.autohome.com.cn",
  "DOMAIN-SUFFIX,pvx.autohome.com.cn",
  "DOMAIN-SUFFIX,rd.autohome.com.cn",
  "DOMAIN-SUFFIX,rdx.autohome.com.cn",
  "DOMAIN-SUFFIX,stats.autohome.com.cn",
  "DOMAIN-SUFFIX,a.baidu.cn",
  "DOMAIN-SUFFIX,a.baidu.com",
  "DOMAIN-SUFFIX,ad.duapps.com",
  "DOMAIN-SUFFIX,ad.player.baidu.com",
  "DOMAIN-SUFFIX,adm.baidu.cn",
  "DOMAIN-SUFFIX,adm.baidu.com",
  "DOMAIN-SUFFIX,adscdn.baidu.cn",
  "DOMAIN-SUFFIX,adscdn.baidu.com",
  "DOMAIN-SUFFIX,adx.xiaodutv.com",
  "DOMAIN-SUFFIX,ae.bdstatic.com",
  "DOMAIN-SUFFIX,afd.baidu.cn",
  "DOMAIN-SUFFIX,afd.baidu.com",
  "DOMAIN-SUFFIX,als.baidu.cn",
  "DOMAIN-SUFFIX,als.baidu.com",
  "DOMAIN-SUFFIX,anquan.baidu.cn",
  "DOMAIN-SUFFIX,anquan.baidu.com",
  "DOMAIN-SUFFIX,antivirus.baidu.com",
  "DOMAIN-SUFFIX,api.mobula.sdk.duapps.com",
  "DOMAIN-SUFFIX,appc.baidu.cn",
  "DOMAIN-SUFFIX,appc.baidu.com",
  "DOMAIN-SUFFIX,as.baidu.cn",
  "DOMAIN-SUFFIX,as.baidu.com",
  "DOMAIN-SUFFIX,baichuan.baidu.com",
  "DOMAIN-SUFFIX,baidu9635.com",
  "DOMAIN-SUFFIX,baidustatic.com",
  "DOMAIN-SUFFIX,baidutv.baidu.com",
  "DOMAIN-SUFFIX,banlv.baidu.com",
  "DOMAIN-SUFFIX,bar.baidu.com",
  "DOMAIN-SUFFIX,bdplus.baidu.com",
  "DOMAIN-SUFFIX,btlaunch.baidu.com",
  "DOMAIN-SUFFIX,c.baidu.cn",
  "DOMAIN-SUFFIX,c.baidu.com",
  "DOMAIN-SUFFIX,cb.baidu.cn",
  "DOMAIN-SUFFIX,cb.baidu.com",
  "DOMAIN-SUFFIX,cbjs.baidu.cn",
  "DOMAIN-SUFFIX,cbjs.baidu.com",
  "DOMAIN-SUFFIX,cbjslog.baidu.cn",
  "DOMAIN-SUFFIX,cbjslog.baidu.com",
  "DOMAIN-SUFFIX,cjhq.baidu.cn",
  "DOMAIN-SUFFIX,cjhq.baidu.com",
  "DOMAIN-SUFFIX,cleaner.baidu.com",
  "DOMAIN-SUFFIX,click.bes.baidu.com",
  "DOMAIN-SUFFIX,click.hm.baidu.com",
  "DOMAIN-SUFFIX,click.qianqian.com",
  "DOMAIN-SUFFIX,cm.baidu.com",
  "DOMAIN-SUFFIX,cpro.baidu.cn",
  "DOMAIN-SUFFIX,cpro.baidu.com",
  "DOMAIN-SUFFIX,cpro.baidustatic.com",
  "DOMAIN-SUFFIX,cpro.tieba.baidu.com",
  "DOMAIN-SUFFIX,cpro.zhidao.baidu.com",
  "DOMAIN-SUFFIX,cpro2.baidu.cn",
  "DOMAIN-SUFFIX,cpro2.baidu.com",
  "DOMAIN-SUFFIX,cpu-admin.baidu.com",
  "DOMAIN-SUFFIX,crs.baidu.cn",
  "DOMAIN-SUFFIX,crs.baidu.com",
  "DOMAIN-SUFFIX,datax.baidu.com",
  "DOMAIN-SUFFIX,dl-vip.bav.baidu.com",
  "DOMAIN-SUFFIX,dl-vip.pcfaster.baidu.co.th",
  "DOMAIN-SUFFIX,dl.client.baidu.com",
  "DOMAIN-SUFFIX,dl.ops.baidu.com",
  "DOMAIN-SUFFIX,dl1sw.baidu.com",
  "DOMAIN-SUFFIX,dl2.bav.baidu.com",
  "DOMAIN-SUFFIX,dlsw.baidu.com",
  "DOMAIN-SUFFIX,dlsw.br.baidu.com",
  "DOMAIN-SUFFIX,download.bav.baidu.com",
  "DOMAIN-SUFFIX,download.sd.baidu.com",
  "DOMAIN-SUFFIX,drmcmm.baidu.cn",
  "DOMAIN-SUFFIX,drmcmm.baidu.com",
  "DOMAIN-SUFFIX,dup.baidustatic.com",
  "DOMAIN-SUFFIX,dxp.baidu.com",
  "DOMAIN-SUFFIX,dzl.baidu.com",
  "DOMAIN-SUFFIX,e.baidu.cn",
  "DOMAIN-SUFFIX,e.baidu.com",
  "DOMAIN-SUFFIX,eclick.baidu.cn",
  "DOMAIN-SUFFIX,eclick.baidu.com",
  "DOMAIN-SUFFIX,ecma.bdimg.com",
  "DOMAIN-SUFFIX,ecmb.bdimg.com",
  "DOMAIN-SUFFIX,ecmc.bdimg.com",
  "DOMAIN-SUFFIX,eiv.baidu.cn",
  "DOMAIN-SUFFIX,eiv.baidu.com",
  "DOMAIN-SUFFIX,em.baidu.com",
  "DOMAIN-SUFFIX,ers.baidu.com",
  "DOMAIN-SUFFIX,f10.baidu.com",
  "DOMAIN-SUFFIX,fc-.cdn.bcebos.com",
  "DOMAIN-SUFFIX,fc-feed.cdn.bcebos.com",
  "DOMAIN-SUFFIX,fclick.baidu.com",
  "DOMAIN-SUFFIX,fexclick.baidu.com",
  "DOMAIN-SUFFIX,g.baidu.com",
  "DOMAIN-SUFFIX,gimg.baidu.com",
  "DOMAIN-SUFFIX,guanjia.baidu.com",
  "DOMAIN-SUFFIX,hc.baidu.cn",
  "DOMAIN-SUFFIX,hc.baidu.com",
  "DOMAIN-SUFFIX,hm.baidu.cn",
  "DOMAIN-SUFFIX,hm.baidu.com",
  "DOMAIN-SUFFIX,hmma.baidu.cn",
  "DOMAIN-SUFFIX,hmma.baidu.com",
  "DOMAIN-SUFFIX,hpd.baidu.cn",
  "DOMAIN-SUFFIX,hpd.baidu.com",
  "DOMAIN-SUFFIX,idm-su.baidu.com",
  "DOMAIN-SUFFIX,iebar.baidu.com",
  "DOMAIN-SUFFIX,ikcode.baidu.com",
  "DOMAIN-SUFFIX,imageplus.baidu.cn",
  "DOMAIN-SUFFIX,imageplus.baidu.com",
  "DOMAIN-SUFFIX,img.taotaosou.cn",
  "DOMAIN-SUFFIX,img01.taotaosou.cn",
  "DOMAIN-SUFFIX,itsdata.map.baidu.com",
  "DOMAIN-SUFFIX,j.br.baidu.com",
  "DOMAIN-SUFFIX,kstj.baidu.com",
  "DOMAIN-SUFFIX,log.music.baidu.com",
  "DOMAIN-SUFFIX,log.nuomi.com",
  "DOMAIN-SUFFIX,m1.baidu.com",
  "DOMAIN-SUFFIX,ma.baidu.cn",
  "DOMAIN-SUFFIX,ma.baidu.com",
  "DOMAIN-SUFFIX,mg09.zhaopin.com",
  "DOMAIN-SUFFIX,mipcache.bdstatic.com",
  "DOMAIN-SUFFIX,mobads-logs.baidu.cn",
  "DOMAIN-SUFFIX,mobads-logs.baidu.com",
  "DOMAIN-SUFFIX,mobads.baidu.cn",
  "DOMAIN-SUFFIX,mobads.baidu.com",
  "DOMAIN-SUFFIX,mpro.baidu.com",
  "DOMAIN-SUFFIX,mtj.baidu.cn",
  "DOMAIN-SUFFIX,mtj.baidu.com",
  "DOMAIN-SUFFIX,neirong.baidu.com",
  "DOMAIN-SUFFIX,nsclick.baidu.cn",
  "DOMAIN-SUFFIX,nsclick.baidu.com",
  "DOMAIN-SUFFIX,nsclickvideo.baidu.com",
  "DOMAIN-SUFFIX,openrcv.baidu.com",
  "DOMAIN-SUFFIX,pc.videoclick.baidu.com",
  "DOMAIN-SUFFIX,pos.baidu.com",
  "DOMAIN-SUFFIX,pups.baidu.cn",
  "DOMAIN-SUFFIX,pups.baidu.com",
  "DOMAIN-SUFFIX,pups.bdimg.com",
  "DOMAIN-SUFFIX,push.music.baidu.com",
  "DOMAIN-SUFFIX,push.zhanzhang.baidu.com",
  "DOMAIN-SUFFIX,qchannel0d.cn",
  "DOMAIN-SUFFIX,qianclick.baidu.com",
  "DOMAIN-SUFFIX,release.baidu.com",
  "DOMAIN-SUFFIX,res.limei.com",
  "DOMAIN-SUFFIX,res.mi.baidu.com",
  "DOMAIN-SUFFIX,rigel.baidustatic.com",
  "DOMAIN-SUFFIX,river.zhidao.baidu.com",
  "DOMAIN-SUFFIX,rj.baidu.cn",
  "DOMAIN-SUFFIX,rj.baidu.com",
  "DOMAIN-SUFFIX,rp.baidu.cn",
  "DOMAIN-SUFFIX,rp.baidu.com",
  "DOMAIN-SUFFIX,rplog.baidu.com",
  "DOMAIN-SUFFIX,s.baidu.com",
  "DOMAIN-SUFFIX,sclick.baidu.com",
  "DOMAIN-SUFFIX,sestat.baidu.com",
  "DOMAIN-SUFFIX,shadu.baidu.com",
  "DOMAIN-SUFFIX,share.baidu.com",
  "DOMAIN-SUFFIX,sobar.baidu.com",
  "DOMAIN-SUFFIX,sobartop.baidu.com",
  "DOMAIN-SUFFIX,spcode.baidu.cn",
  "DOMAIN-SUFFIX,spcode.baidu.com",
  "DOMAIN-SUFFIX,stat.v.baidu.com",
  "DOMAIN-SUFFIX,su.bdimg.com",
  "DOMAIN-SUFFIX,su.bdstatic.com",
  "DOMAIN-SUFFIX,tk.baidu.cn",
  "DOMAIN-SUFFIX,tk.baidu.com",
  "DOMAIN-SUFFIX,tkweb.baidu.com",
  "DOMAIN-SUFFIX,tob-cms.bj.bcebos.com",
  "DOMAIN-SUFFIX,toolbar.baidu.com",
  "DOMAIN-SUFFIX,tracker.baidu.com",
  "DOMAIN-SUFFIX,tuijian.baidu.com",
  "DOMAIN-SUFFIX,tuisong.baidu.cn",
  "DOMAIN-SUFFIX,tuisong.baidu.com",
  "DOMAIN-SUFFIX,ubmcmm.baidustatic.com",
  "DOMAIN-SUFFIX,ucstat.baidu.cn",
  "DOMAIN-SUFFIX,ucstat.baidu.com",
  "DOMAIN-SUFFIX,ulic.baidu.com",
  "DOMAIN-SUFFIX,ulog.imap.baidu.com",
  "DOMAIN-SUFFIX,union.baidu.cn",
  "DOMAIN-SUFFIX,union.baidu.com",
  "DOMAIN-SUFFIX,unionimage.baidu.com",
  "DOMAIN-SUFFIX,utility.baidu.cn",
  "DOMAIN-SUFFIX,utility.baidu.com",
  "DOMAIN-SUFFIX,utk.baidu.cn",
  "DOMAIN-SUFFIX,utk.baidu.com",
  "DOMAIN-SUFFIX,videopush.baidu.cn",
  "DOMAIN-SUFFIX,videopush.baidu.com",
  "DOMAIN-SUFFIX,vv84.bj.bcebos.com",
  "DOMAIN-SUFFIX,w.gdown.baidu.com",
  "DOMAIN-SUFFIX,w.x.baidu.com",
  "DOMAIN-SUFFIX,wangmeng.baidu.cn",
  "DOMAIN-SUFFIX,wangmeng.baidu.com",
  "DOMAIN-SUFFIX,weishi.baidu.com",
  "DOMAIN-SUFFIX,wenku-cms.bj.bcebos.com",
  "DOMAIN-SUFFIX,wisepush.video.baidu.com",
  "DOMAIN-SUFFIX,wm.baidu.cn",
  "DOMAIN-SUFFIX,wm.baidu.com",
  "DOMAIN-SUFFIX,znsv.baidu.cn",
  "DOMAIN-SUFFIX,znsv.baidu.com",
  "DOMAIN-SUFFIX,zz.bdstatic.com",
  "DOMAIN-SUFFIX,zzy1.quyaoya.com",
  "DOMAIN-SUFFIX,ad.zhangyue.com",
  "DOMAIN-SUFFIX,adm.ps.easou.com",
  "DOMAIN-SUFFIX,aishowbger.com",
  "DOMAIN-SUFFIX,api.itaoxiaoshuo.com",
  "DOMAIN-SUFFIX,assets.ps.easou.com",
  "DOMAIN-SUFFIX,bbcoe.cn",
  "DOMAIN-SUFFIX,cj.qidian.com",
  "DOMAIN-SUFFIX,dkeyn.com",
  "DOMAIN-SUFFIX,drdwy.com",
  "DOMAIN-SUFFIX,e.aa985.cn",
  "DOMAIN-SUFFIX,e.v02u9.cn",
  "DOMAIN-SUFFIX,e701.net",
  "DOMAIN-SUFFIX,ehxyz.com",
  "DOMAIN-SUFFIX,ethod.gzgmjcx.com",
  "DOMAIN-SUFFIX,focuscat.com",
  "DOMAIN-SUFFIX,game.qidian.com",
  "DOMAIN-SUFFIX,hdswgc.com",
  "DOMAIN-SUFFIX,jyd.fjzdmy.com",
  "DOMAIN-SUFFIX,m.ourlj.com",
  "DOMAIN-SUFFIX,m.txtxr.com",
  "DOMAIN-SUFFIX,m.vsxet.com",
  "DOMAIN-SUFFIX,miam4.cn",
  "DOMAIN-SUFFIX,o.if.qidian.com",
  "DOMAIN-SUFFIX,p.vq6nsu.cn",
  "DOMAIN-SUFFIX,picture.duokan.com",
  "DOMAIN-SUFFIX,push.zhangyue.com",
  "DOMAIN-SUFFIX,pyerc.com",
  "DOMAIN-SUFFIX,s1.cmfu.com",
  "DOMAIN-SUFFIX,sc.shayugg.com",
  "DOMAIN-SUFFIX,sdk.cferw.com",
  "DOMAIN-SUFFIX,sezvc.com",
  "DOMAIN-SUFFIX,sys.zhangyue.com",
  "DOMAIN-SUFFIX,tjlog.ps.easou.com",
  "DOMAIN-SUFFIX,tongji.qidian.com",
  "DOMAIN-SUFFIX,ut2.shuqistat.com",
  "DOMAIN-SUFFIX,xgcsr.com",
  "DOMAIN-SUFFIX,xjq.jxmqkj.com",
  "DOMAIN-SUFFIX,xpe.cxaerp.com",
  "DOMAIN-SUFFIX,xtzxmy.com",
  "DOMAIN-SUFFIX,xyrkl.com",
  "DOMAIN-SUFFIX,zhuanfakong.com",
  "DOMAIN-SUFFIX,ad.toutiao.com",
  "DOMAIN-SUFFIX,dsp.toutiao.com",
  "DOMAIN-SUFFIX,ic.snssdk.com",
  "DOMAIN-SUFFIX,log.snssdk.com",
  "DOMAIN-SUFFIX,nativeapp.toutiao.com",
  "DOMAIN-SUFFIX,pangolin-sdk-toutiao-b.com",
  "DOMAIN-SUFFIX,pangolin-sdk-toutiao.com",
  "DOMAIN-SUFFIX,pangolin.snssdk.com",
  "DOMAIN-SUFFIX,partner.toutiao.com",
  "DOMAIN-SUFFIX,pglstatp-toutiao.com",
  "DOMAIN-SUFFIX,sm.toutiao.com",
  "DOMAIN-SUFFIX,a.dangdang.com",
  "DOMAIN-SUFFIX,click.dangdang.com",
  "DOMAIN-SUFFIX,schprompt.dangdang.com",
  "DOMAIN-SUFFIX,t.dangdang.com",
  "DOMAIN-SUFFIX,ad.duomi.com",
  "DOMAIN-SUFFIX,boxshows.com",
  "DOMAIN-SUFFIX,staticxx.facebook.com",
  "DOMAIN-SUFFIX,click1n.soufun.com",
  "DOMAIN-SUFFIX,clickm.fang.com",
  "DOMAIN-SUFFIX,clickn.fang.com",
  "DOMAIN-SUFFIX,countpvn.light.fang.com",
  "DOMAIN-SUFFIX,countubn.light.soufun.com",
  "DOMAIN-SUFFIX,mshow.fang.com",
  "DOMAIN-SUFFIX,tongji.home.soufun.com",
  "DOMAIN-SUFFIX,admob.com",
  "DOMAIN-SUFFIX,ads.gmodules.com",
  "DOMAIN-SUFFIX,ads.google.com",
  "DOMAIN-SUFFIX,adservice.google.com",
  "DOMAIN-SUFFIX,afd.l.google.com",
  "DOMAIN-SUFFIX,badad.googleplex.com",
  "DOMAIN-SUFFIX,csi.gstatic.com",
  "DOMAIN-SUFFIX,doubleclick.com",
  "DOMAIN-SUFFIX,doubleclick.net",
  "DOMAIN-SUFFIX,google-analytics.com",
  "DOMAIN-SUFFIX,googleadservices.com",
  "DOMAIN-SUFFIX,googleadsserving.cn",
  "DOMAIN-SUFFIX,googlecommerce.com",
  "DOMAIN-SUFFIX,googlesyndication.com",
  "DOMAIN-SUFFIX,mobileads.google.com",
  "DOMAIN-SUFFIX,pagead-tpc.l.google.com",
  "DOMAIN-SUFFIX,pagead.google.com",
  "DOMAIN-SUFFIX,pagead.l.google.com",
  "DOMAIN-SUFFIX,service.urchin.com",
  "DOMAIN-SUFFIX,ads.union.jd.com",
  "DOMAIN-SUFFIX,c-nfa.jd.com",
  "DOMAIN-SUFFIX,cps.360buy.com",
  "DOMAIN-SUFFIX,img-x.jd.com",
  "DOMAIN-SUFFIX,jrclick.jd.com",
  "DOMAIN-SUFFIX,jzt.jd.com",
  "DOMAIN-SUFFIX,policy.jd.com",
  "DOMAIN-SUFFIX,stat.m.jd.com",
  "DOMAIN-SUFFIX,ads.service.kugou.com",
  "DOMAIN-SUFFIX,adsfile.bssdlbig.kugou.com",
  "DOMAIN-SUFFIX,d.kugou.com",
  "DOMAIN-SUFFIX,downmobile.kugou.com",
  "DOMAIN-SUFFIX,gad.kugou.com",
  "DOMAIN-SUFFIX,game.kugou.com",
  "DOMAIN-SUFFIX,gamebox.kugou.com",
  "DOMAIN-SUFFIX,gcapi.sy.kugou.com",
  "DOMAIN-SUFFIX,gg.kugou.com",
  "DOMAIN-SUFFIX,install.kugou.com",
  "DOMAIN-SUFFIX,install2.kugou.com",
  "DOMAIN-SUFFIX,kgmobilestat.kugou.com",
  "DOMAIN-SUFFIX,kuaikaiapp.com",
  "DOMAIN-SUFFIX,log.stat.kugou.com",
  "DOMAIN-SUFFIX,log.web.kugou.com",
  "DOMAIN-SUFFIX,minidcsc.kugou.com",
  "DOMAIN-SUFFIX,mo.kugou.com",
  "DOMAIN-SUFFIX,mobilelog.kugou.com",
  "DOMAIN-SUFFIX,msg.mobile.kugou.com",
  "DOMAIN-SUFFIX,mvads.kugou.com",
  "DOMAIN-SUFFIX,p.kugou.com",
  "DOMAIN-SUFFIX,push.mobile.kugou.com",
  "DOMAIN-SUFFIX,rtmonitor.kugou.com",
  "DOMAIN-SUFFIX,sdn.kugou.com",
  "DOMAIN-SUFFIX,tj.kugou.com",
  "DOMAIN-SUFFIX,update.mobile.kugou.com",
  "DOMAIN-SUFFIX,apk.shouji.koowo.com",
  "DOMAIN-SUFFIX,deliver.kuwo.cn",
  "DOMAIN-SUFFIX,g.koowo.com",
  "DOMAIN-SUFFIX,g.kuwo.cn",
  "DOMAIN-SUFFIX,kwmsg.kuwo.cn",
  "DOMAIN-SUFFIX,log.kuwo.cn",
  "DOMAIN-SUFFIX,mobilead.kuwo.cn",
  "DOMAIN-SUFFIX,msclick2.kuwo.cn",
  "DOMAIN-SUFFIX,msphoneclick.kuwo.cn",
  "DOMAIN-SUFFIX,updatepage.kuwo.cn",
  "DOMAIN-SUFFIX,wa.kuwo.cn",
  "DOMAIN-SUFFIX,webstat.kuwo.cn",
  "DOMAIN-SUFFIX,aider-res.meizu.com",
  "DOMAIN-SUFFIX,api-flow.meizu.com",
  "DOMAIN-SUFFIX,api-game.meizu.com",
  "DOMAIN-SUFFIX,api-push.meizu.com",
  "DOMAIN-SUFFIX,aries.mzres.com",
  "DOMAIN-SUFFIX,bro.flyme.cn",
  "DOMAIN-SUFFIX,cal.meizu.com",
  "DOMAIN-SUFFIX,ebook.meizu.com",
  "DOMAIN-SUFFIX,ebook.res.meizu.com",
  "DOMAIN-SUFFIX,game-res.meizu.com",
  "DOMAIN-SUFFIX,game.res.meizu.com",
  "DOMAIN-SUFFIX,infocenter.meizu.com",
  "DOMAIN-SUFFIX,openapi-news.meizu.com",
  "DOMAIN-SUFFIX,push.res.meizu.com",
  "DOMAIN-SUFFIX,reader.meizu.com",
  "DOMAIN-SUFFIX,reader.res.meizu.com",
  "DOMAIN-SUFFIX,t-e.flyme.cn",
  "DOMAIN-SUFFIX,t-flow.flyme.cn",
  "DOMAIN-SUFFIX,tongji-res1.meizu.com",
  "DOMAIN-SUFFIX,tongji.meizu.com",
  "DOMAIN-SUFFIX,umid.orion.meizu.com",
  "DOMAIN-SUFFIX,upush.res.meizu.com",
  "DOMAIN-SUFFIX,uxip.meizu.com",
  "DOMAIN-SUFFIX,a.koudai.com",
  "DOMAIN-SUFFIX,adui.tg.meitu.com",
  "DOMAIN-SUFFIX,corp.meitu.com",
  "DOMAIN-SUFFIX,dc.meitustat.com",
  "DOMAIN-SUFFIX,gg.meitu.com",
  "DOMAIN-SUFFIX,mdc.meitustat.com",
  "DOMAIN-SUFFIX,meitubeauty.meitudata.com",
  "DOMAIN-SUFFIX,message.meitu.com",
  "DOMAIN-SUFFIX,rabbit.meitustat.com",
  "DOMAIN-SUFFIX,rabbit.tg.meitu.com",
  "DOMAIN-SUFFIX,tuiguang.meitu.com",
  "DOMAIN-SUFFIX,xiuxiu.android.dl.meitu.com",
  "DOMAIN-SUFFIX,xiuxiu.mobile.meitudata.com",
  "DOMAIN-SUFFIX,a.market.xiaomi.com",
  "DOMAIN-SUFFIX,ad.xiaomi.com",
  "DOMAIN-SUFFIX,ad1.xiaomi.com",
  "DOMAIN-SUFFIX,adv.sec.intl.miui.com",
  "DOMAIN-SUFFIX,adv.sec.miui.com",
  "DOMAIN-SUFFIX,bss.pandora.xiaomi.com",
  "DOMAIN-SUFFIX,d.g.mi.com",
  "DOMAIN-SUFFIX,data.mistat.xiaomi.com",
  "DOMAIN-SUFFIX,de.pandora.xiaomi.com",
  "DOMAIN-SUFFIX,dvb.pandora.xiaomi.com",
  "DOMAIN-SUFFIX,jellyfish.pandora.xiaomi.com",
  "DOMAIN-SUFFIX,migc.g.mi.com",
  "DOMAIN-SUFFIX,migcreport.g.mi.com",
  "DOMAIN-SUFFIX,notice.game.xiaomi.com",
  "DOMAIN-SUFFIX,ppurifier.game.xiaomi.com",
  "DOMAIN-SUFFIX,r.browser.miui.com",
  "DOMAIN-SUFFIX,security.browser.miui.com",
  "DOMAIN-SUFFIX,shenghuo.xiaomi.com",
  "DOMAIN-SUFFIX,stat.pandora.xiaomi.com",
  "DOMAIN-SUFFIX,union.mi.com",
  "DOMAIN-SUFFIX,wtradv.market.xiaomi.com",
  "DOMAIN-SUFFIX,ad.api.moji.com",
  "DOMAIN-SUFFIX,app.moji001.com",
  "DOMAIN-SUFFIX,cdn.moji002.com",
  "DOMAIN-SUFFIX,cdn2.moji002.com",
  "DOMAIN-SUFFIX,fds.api.moji.com",
  "DOMAIN-SUFFIX,log.moji.com",
  "DOMAIN-SUFFIX,stat.moji.com",
  "DOMAIN-SUFFIX,ugc.moji001.com",
  "DOMAIN-SUFFIX,ad.qingting.fm",
  "DOMAIN-SUFFIX,admgr.qingting.fm",
  "DOMAIN-SUFFIX,dload.qd.qingting.fm",
  "DOMAIN-SUFFIX,logger.qingting.fm",
  "DOMAIN-SUFFIX,s.qd.qingting.fm",
  "DOMAIN-SUFFIX,s.qd.qingtingfm.com",
  "DOMAIN-KEYWORD,omgmtaw",
  "DOMAIN,adsmind.apdcdn.tc.qq.com",
  "DOMAIN,adsmind.gdtimg.com",
  "DOMAIN,adsmind.tc.qq.com",
  "DOMAIN,pgdt.gtimg.cn",
  "DOMAIN,pgdt.gtimg.com",
  "DOMAIN,pgdt.ugdtimg.com",
  "DOMAIN,splashqqlive.gtimg.com",
  "DOMAIN,wa.gtimg.com",
  "DOMAIN,wxsnsdy.wxs.qq.com",
  "DOMAIN,wxsnsdythumb.wxs.qq.com",
  "DOMAIN-SUFFIX,act.qq.com",
  "DOMAIN-SUFFIX,ad.qun.qq.com",
  "DOMAIN-SUFFIX,adsfile.qq.com",
  "DOMAIN-SUFFIX,bugly.qq.com",
  "DOMAIN-SUFFIX,buluo.qq.com",
  "DOMAIN-SUFFIX,e.qq.com",
  "DOMAIN-SUFFIX,gdt.qq.com",
  "DOMAIN-SUFFIX,l.qq.com",
  "DOMAIN-SUFFIX,monitor.qq.com",
  "DOMAIN-SUFFIX,pingma.qq.com",
  "DOMAIN-SUFFIX,pingtcss.qq.com",
  "DOMAIN-SUFFIX,report.qq.com",
  "DOMAIN-SUFFIX,tajs.qq.com",
  "DOMAIN-SUFFIX,tcss.qq.com",
  "DOMAIN-SUFFIX,uu.qq.com",
  "DOMAIN-SUFFIX,ebp.renren.com",
  "DOMAIN-SUFFIX,jebe.renren.com",
  "DOMAIN-SUFFIX,jebe.xnimg.cn",
  "DOMAIN-SUFFIX,ad.sina.com.cn",
  "DOMAIN-SUFFIX,adbox.sina.com.cn",
  "DOMAIN-SUFFIX,add.sina.com.cn",
  "DOMAIN-SUFFIX,adimg.mobile.sina.cn",
  "DOMAIN-SUFFIX,adm.sina.com.cn",
  "DOMAIN-SUFFIX,alitui.weibo.com.cn",
  "DOMAIN-SUFFIX,biz.weibo.com.cn",
  "DOMAIN-SUFFIX,cre.dp.sina.cn",
  "DOMAIN-SUFFIX,dcads.sina.com.cn",
  "DOMAIN-SUFFIX,dd.sina.com.cn",
  "DOMAIN-SUFFIX,dmp.sina.com.cn",
  "DOMAIN-SUFFIX,game.weibo.com.cn",
  "DOMAIN-SUFFIX,gw5.push.mcp.weibo.cn",
  "DOMAIN-SUFFIX,leju.sina.com.cn",
  "DOMAIN-SUFFIX,log.mix.sina.com.cn",
  "DOMAIN-SUFFIX,mobileads.dx.cn",
  "DOMAIN-SUFFIX,newspush.sinajs.cn",
  "DOMAIN-SUFFIX,pay.mobile.sina.cn",
  "DOMAIN-SUFFIX,sax.mobile.sina.cn",
  "DOMAIN-SUFFIX,sax.sina.com.cn",
  "DOMAIN-SUFFIX,saxd.sina.com.cn",
  "DOMAIN-SUFFIX,sdkapp.mobile.sina.cn",
  "DOMAIN-SUFFIX,sdkapp.uve.weibo.com",
  "DOMAIN-SUFFIX,sdkclick.mobile.sina.cn",
  "DOMAIN-SUFFIX,slog.sina.com.cn",
  "DOMAIN-SUFFIX,trends.mobile.sina.cn",
  "DOMAIN-SUFFIX,tui.weibo.com",
  "DOMAIN-SUFFIX,u1.img.mobile.sina.cn",
  "DOMAIN-SUFFIX,wax.weibo.com.cn",
  "DOMAIN-SUFFIX,wbapp.mobile.sina.cn",
  "DOMAIN-SUFFIX,wbapp.uve.weibo.com",
  "DOMAIN-SUFFIX,wbclick.mobile.sina.cn",
  "DOMAIN-SUFFIX,wbpctips.mobile.sina.cn",
  "DOMAIN-SUFFIX,zymo.mps.weibo.com",
  "DOMAIN-SUFFIX,123.sogou.com",
  "DOMAIN-SUFFIX,123.sogoucdn.com",
  "DOMAIN-SUFFIX,adsence.sogou.com",
  "DOMAIN-SUFFIX,amfi.gou.sogou.com",
  "DOMAIN-SUFFIX,brand.sogou.com",
  "DOMAIN-SUFFIX,cpc.sogou.com",
  "DOMAIN-SUFFIX,epro.sogou.com",
  "DOMAIN-SUFFIX,fair.sogou.com",
  "DOMAIN-SUFFIX,files2.sogou.com",
  "DOMAIN-SUFFIX,galaxy.sogoucdn.com",
  "DOMAIN-SUFFIX,golden1.sogou.com",
  "DOMAIN-SUFFIX,goto.sogou.com",
  "DOMAIN-SUFFIX,inte.sogou.com",
  "DOMAIN-SUFFIX,iwan.sogou.com",
  "DOMAIN-SUFFIX,lu.sogou.com",
  "DOMAIN-SUFFIX,lu.sogoucdn.com",
  "DOMAIN-SUFFIX,pb.sogou.com",
  "DOMAIN-SUFFIX,pd.sogou.com",
  "DOMAIN-SUFFIX,pv.sogou.com",
  "DOMAIN-SUFFIX,theta.sogou.com",
  "DOMAIN-SUFFIX,wan.sogou.com",
  "DOMAIN-SUFFIX,wangmeng.sogou.com",
  "DOMAIN-SUFFIX,applovin.com",
  "DOMAIN-SUFFIX,guangzhuiyuan.com",
  "DOMAIN-SUFFIX,ads-twitter.com",
  "DOMAIN-SUFFIX,ads.twitter.com",
  "DOMAIN-SUFFIX,analytics.twitter.com",
  "DOMAIN-SUFFIX,p.twitter.com",
  "DOMAIN-SUFFIX,scribe.twitter.com",
  "DOMAIN-SUFFIX,syndication-o.twitter.com",
  "DOMAIN-SUFFIX,syndication.twitter.com",
  "DOMAIN-SUFFIX,tellapart.com",
  "DOMAIN-SUFFIX,urls.api.twitter.com",
  "DOMAIN-SUFFIX,adslot.uc.cn",
  "DOMAIN-SUFFIX,api.mp.uc.cn",
  "DOMAIN-SUFFIX,applog.uc.cn",
  "DOMAIN-SUFFIX,client.video.ucweb.com",
  "DOMAIN-SUFFIX,cms.ucweb.com",
  "DOMAIN-SUFFIX,dispatcher.upmc.uc.cn",
  "DOMAIN-SUFFIX,huichuan.sm.cn",
  "DOMAIN-SUFFIX,log.cs.pp.cn",
  "DOMAIN-SUFFIX,m.uczzd.cn",
  "DOMAIN-SUFFIX,patriot.cs.pp.cn",
  "DOMAIN-SUFFIX,puds.ucweb.com",
  "DOMAIN-SUFFIX,server.m.pp.cn",
  "DOMAIN-SUFFIX,track.uc.cn",
  "DOMAIN-SUFFIX,u.uc123.com",
  "DOMAIN-SUFFIX,u.ucfly.com",
  "DOMAIN-SUFFIX,uc.ucweb.com",
  "DOMAIN-SUFFIX,ucsec.ucweb.com",
  "DOMAIN-SUFFIX,ucsec1.ucweb.com",
  "DOMAIN-SUFFIX,aoodoo.feng.com",
  "DOMAIN-SUFFIX,fengbuy.com",
  "DOMAIN-SUFFIX,push.feng.com",
  "DOMAIN-SUFFIX,we.tm",
  "DOMAIN-SUFFIX,yes1.feng.com",
  "DOMAIN-SUFFIX,ad.docer.wps.cn",
  "DOMAIN-SUFFIX,adm.zookingsoft.com",
  "DOMAIN-SUFFIX,bannera.kingsoft-office-service.com",
  "DOMAIN-SUFFIX,bole.shangshufang.ksosoft.com",
  "DOMAIN-SUFFIX,counter.kingsoft.com",
  "DOMAIN-SUFFIX,docerad.wps.cn",
  "DOMAIN-SUFFIX,gou.wps.cn",
  "DOMAIN-SUFFIX,hoplink.ksosoft.com",
  "DOMAIN-SUFFIX,ic.ksosoft.com",
  "DOMAIN-SUFFIX,img.gou.wpscdn.cn",
  "DOMAIN-SUFFIX,info.wps.cn",
  "DOMAIN-SUFFIX,ios-informationplatform.wps.cn",
  "DOMAIN-SUFFIX,minfo.wps.cn",
  "DOMAIN-SUFFIX,mo.res.wpscdn.cn",
  "DOMAIN-SUFFIX,news.docer.com",
  "DOMAIN-SUFFIX,notify.wps.cn",
  "DOMAIN-SUFFIX,pc.uf.ksosoft.com",
  "DOMAIN-SUFFIX,pcfg.wps.cn",
  "DOMAIN-SUFFIX,pixiu.shangshufang.ksosoft.com",
  "DOMAIN-SUFFIX,push.wps.cn",
  "DOMAIN-SUFFIX,rating6.kingsoft-office-service.com",
  "DOMAIN-SUFFIX,up.wps.kingsoft.com",
  "DOMAIN-SUFFIX,wpsweb-dc.wps.cn",
  "DOMAIN-SUFFIX,c.51y5.net",
  "DOMAIN-SUFFIX,cdsget.51y5.net",
  "DOMAIN-SUFFIX,news-imgpb.51y5.net",
  "DOMAIN-SUFFIX,wifiapidd.51y5.net",
  "DOMAIN-SUFFIX,wkanc.51y5.net",
  "DOMAIN-SUFFIX,adse.ximalaya.com",
  "DOMAIN-SUFFIX,linkeye.ximalaya.com",
  "DOMAIN-SUFFIX,location.ximalaya.com",
  "DOMAIN-SUFFIX,xdcs-collector.ximalaya.com",
  "DOMAIN-SUFFIX,biz5.kankan.com",
  "DOMAIN-SUFFIX,float.kankan.com",
  "DOMAIN-SUFFIX,hub5btmain.sandai.net",
  "DOMAIN-SUFFIX,hub5emu.sandai.net",
  "DOMAIN-SUFFIX,logic.cpm.cm.kankan.com",
  "DOMAIN-SUFFIX,upgrade.xl9.xunlei.com",
  "DOMAIN-SUFFIX,ad.wretch.cc",
  "DOMAIN-SUFFIX,ads.yahoo.com",
  "DOMAIN-SUFFIX,adserver.yahoo.com",
  "DOMAIN-SUFFIX,adss.yahoo.com",
  "DOMAIN-SUFFIX,analytics.query.yahoo.com",
  "DOMAIN-SUFFIX,analytics.yahoo.com",
  "DOMAIN-SUFFIX,ane.yahoo.co.jp",
  "DOMAIN-SUFFIX,ard.yahoo.co.jp",
  "DOMAIN-SUFFIX,beap-bc.yahoo.com",
  "DOMAIN-SUFFIX,clicks.beap.bc.yahoo.com",
  "DOMAIN-SUFFIX,comet.yahoo.com",
  "DOMAIN-SUFFIX,doubleplay-conf-yql.media.yahoo.com",
  "DOMAIN-SUFFIX,flurry.com",
  "DOMAIN-SUFFIX,gemini.yahoo.com",
  "DOMAIN-SUFFIX,geo.yahoo.com",
  "DOMAIN-SUFFIX,js-apac-ss.ysm.yahoo.com",
  "DOMAIN-SUFFIX,locdrop.query.yahoo.com",
  "DOMAIN-SUFFIX,onepush.query.yahoo.com",
  "DOMAIN-SUFFIX,p3p.yahoo.com",
  "DOMAIN-SUFFIX,partnerads.ysm.yahoo.com",
  "DOMAIN-SUFFIX,ws.progrss.yahoo.com",
  "DOMAIN-SUFFIX,yads.yahoo.co.jp",
  "DOMAIN-SUFFIX,ybp.yahoo.com",
  "DOMAIN-SUFFIX,shrek.6.cn",
  "DOMAIN-SUFFIX,simba.6.cn",
  "DOMAIN-SUFFIX,union.6.cn",
  "DOMAIN-SUFFIX,logger.baofeng.com",
  "DOMAIN-SUFFIX,xs.houyi.baofeng.net",
  "DOMAIN-SUFFIX,dotcounter.douyutv.com",
  "DOMAIN-SUFFIX,api.newad.ifeng.com",
  "DOMAIN-SUFFIX,exp.3g.ifeng.com",
  "DOMAIN-SUFFIX,game.ifeng.com",
  "DOMAIN-SUFFIX,iis3g.deliver.ifeng.com",
  "DOMAIN-SUFFIX,mfp.deliver.ifeng.com",
  "DOMAIN-SUFFIX,stadig.ifeng.com",
  "DOMAIN-SUFFIX,adm.funshion.com",
  "DOMAIN-SUFFIX,jobsfe.funshion.com",
  "DOMAIN-SUFFIX,po.funshion.com",
  "DOMAIN-SUFFIX,pub.funshion.com",
  "DOMAIN-SUFFIX,pv.funshion.com",
  "DOMAIN-SUFFIX,stat.funshion.com",
  "DOMAIN-SUFFIX,ad.m.iqiyi.com",
  "DOMAIN-SUFFIX,afp.iqiyi.com",
  "DOMAIN-SUFFIX,c.uaa.iqiyi.com",
  "DOMAIN-SUFFIX,cloudpush.iqiyi.com",
  "DOMAIN-SUFFIX,cm.passport.iqiyi.com",
  "DOMAIN-SUFFIX,cupid.iqiyi.com",
  "DOMAIN-SUFFIX,emoticon.sns.iqiyi.com",
  "DOMAIN-SUFFIX,gamecenter.iqiyi.com",
  "DOMAIN-SUFFIX,ifacelog.iqiyi.com",
  "DOMAIN-SUFFIX,mbdlog.iqiyi.com",
  "DOMAIN-SUFFIX,meta.video.qiyi.com",
  "DOMAIN-SUFFIX,msg.71.am",
  "DOMAIN-SUFFIX,msg1.video.qiyi.com",
  "DOMAIN-SUFFIX,msg2.video.qiyi.com",
  "DOMAIN-SUFFIX,paopao.iqiyi.com",
  "DOMAIN-SUFFIX,paopaod.qiyipic.com",
  "DOMAIN-SUFFIX,policy.video.iqiyi.com",
  "DOMAIN-SUFFIX,yuedu.iqiyi.com",
  "IP-CIDR,101.227.200.0/24,no-resolve",
  "IP-CIDR,101.227.200.11/32,no-resolve",
  "IP-CIDR,101.227.200.28/32,no-resolve",
  "IP-CIDR,101.227.97.240/32,no-resolve",
  "IP-CIDR,124.192.153.42/32,no-resolve",
  "DOMAIN-SUFFIX,gug.ku6cdn.com",
  "DOMAIN-SUFFIX,pq.stat.ku6.com",
  "DOMAIN-SUFFIX,st.vq.ku6.cn",
  "DOMAIN-SUFFIX,static.ku6.com",
  "DOMAIN-SUFFIX,1.letvlive.com",
  "DOMAIN-SUFFIX,2.letvlive.com",
  "DOMAIN-SUFFIX,ark.letv.com",
  "DOMAIN-SUFFIX,dc.letv.com",
  "DOMAIN-SUFFIX,fz.letv.com",
  "DOMAIN-SUFFIX,g3.letv.com",
  "DOMAIN-SUFFIX,game.letvstore.com",
  "DOMAIN-SUFFIX,i0.letvimg.com",
  "DOMAIN-SUFFIX,i3.letvimg.com",
  "DOMAIN-SUFFIX,minisite.letv.com",
  "DOMAIN-SUFFIX,n.mark.letv.com",
  "DOMAIN-SUFFIX,pro.hoye.letv.com",
  "DOMAIN-SUFFIX,pro.letv.com",
  "DOMAIN-SUFFIX,stat.letv.com",
  "DOMAIN-SUFFIX,static.app.m.letv.com",
  "DOMAIN-SUFFIX,click.hunantv.com",
  "DOMAIN-SUFFIX,da.hunantv.com",
  "DOMAIN-SUFFIX,da.mgtv.com",
  "DOMAIN-SUFFIX,log.hunantv.com",
  "DOMAIN-SUFFIX,log.v2.hunantv.com",
  "DOMAIN-SUFFIX,p2.hunantv.com",
  "DOMAIN-SUFFIX,res.hunantv.com",
  "DOMAIN-SUFFIX,888.tv.sohu.com",
  "DOMAIN-SUFFIX,adnet.sohu.com",
  "DOMAIN-SUFFIX,ads.sohu.com",
  "DOMAIN-SUFFIX,aty.hd.sohu.com",
  "DOMAIN-SUFFIX,aty.sohu.com",
  "DOMAIN-SUFFIX,bd.hd.sohu.com",
  "DOMAIN-SUFFIX,click.hd.sohu.com",
  "DOMAIN-SUFFIX,click2.hd.sohu.com",
  "DOMAIN-SUFFIX,ctr.hd.sohu.com",
  "DOMAIN-SUFFIX,epro.sogou.com",
  "DOMAIN-SUFFIX,epro.sohu.com",
  "DOMAIN-SUFFIX,go.sohu.com",
  "DOMAIN-SUFFIX,golden1.sogou.com",
  "DOMAIN-SUFFIX,golden1.sohu.com",
  "DOMAIN-SUFFIX,hui.sohu.com",
  "DOMAIN-SUFFIX,inte.sogou.com",
  "DOMAIN-SUFFIX,inte.sogoucdn.com",
  "DOMAIN-SUFFIX,inte.sohu.com",
  "DOMAIN-SUFFIX,lm.tv.sohu.com",
  "DOMAIN-SUFFIX,lu.sogoucdn.com",
  "DOMAIN-SUFFIX,pb.hd.sohu.com",
  "DOMAIN-SUFFIX,push.tv.sohu.com",
  "DOMAIN-SUFFIX,pv.hd.sohu.com",
  "DOMAIN-SUFFIX,pv.sogou.com",
  "DOMAIN-SUFFIX,pv.sohu.com",
  "DOMAIN-SUFFIX,theta.sogoucdn.com",
  "DOMAIN-SUFFIX,um.hd.sohu.com",
  "DOMAIN-SUFFIX,uranus.sogou.com",
  "DOMAIN-SUFFIX,uranus.sohu.com",
  "DOMAIN-SUFFIX,wan.sohu.com",
  "DOMAIN-SUFFIX,wl.hd.sohu.com",
  "DOMAIN-SUFFIX,yule.sohu.com",
  "DOMAIN-SUFFIX,afp.pplive.com",
  "DOMAIN-SUFFIX,app.aplus.pptv.com",
  "DOMAIN-SUFFIX,as.aplus.pptv.com",
  "DOMAIN-SUFFIX,asimgs.pplive.cn",
  "DOMAIN-SUFFIX,de.as.pptv.com",
  "DOMAIN-SUFFIX,jp.as.pptv.com",
  "DOMAIN-SUFFIX,pp2.pptv.com",
  "DOMAIN-SUFFIX,stat.pptv.com",
  "DOMAIN-SUFFIX,btrace.video.qq.com",
  "DOMAIN-SUFFIX,c.l.qq.com",
  "DOMAIN-SUFFIX,dp3.qq.com",
  "DOMAIN-SUFFIX,livep.l.qq.com",
  "DOMAIN-SUFFIX,lives.l.qq.com",
  "DOMAIN-SUFFIX,livew.l.qq.com",
  "DOMAIN-SUFFIX,mcgi.v.qq.com",
  "DOMAIN-SUFFIX,mdevstat.qqlive.qq.com",
  "DOMAIN-SUFFIX,omgmta1.qq.com",
  "DOMAIN-SUFFIX,p.l.qq.com",
  "DOMAIN-SUFFIX,rcgi.video.qq.com",
  "DOMAIN-SUFFIX,t.l.qq.com",
  "DOMAIN-SUFFIX,u.l.qq.com",
  "DOMAIN-SUFFIX,a-dxk.play.api.3g.youku.com",
  "DOMAIN-SUFFIX,actives.youku.com",
  "DOMAIN-SUFFIX,ad.api.3g.tudou.com",
  "DOMAIN-SUFFIX,ad.api.3g.youku.com",
  "DOMAIN-SUFFIX,ad.api.mobile.youku.com",
  "DOMAIN-SUFFIX,ad.mobile.youku.com",
  "DOMAIN-SUFFIX,adcontrol.tudou.com",
  "DOMAIN-SUFFIX,adplay.tudou.com",
  "DOMAIN-SUFFIX,b.smartvideo.youku.com",
  "DOMAIN-SUFFIX,c.yes.youku.com",
  "DOMAIN-SUFFIX,dev-push.m.youku.com",
  "DOMAIN-SUFFIX,dl.g.youku.com",
  "DOMAIN-SUFFIX,dmapp.youku.com",
  "DOMAIN-SUFFIX,e.stat.ykimg.com",
  "DOMAIN-SUFFIX,gamex.mobile.youku.com",
  "DOMAIN-SUFFIX,goods.tudou.com",
  "DOMAIN-SUFFIX,hudong.pl.youku.com",
  "DOMAIN-SUFFIX,hz.youku.com",
  "DOMAIN-SUFFIX,iwstat.tudou.com",
  "DOMAIN-SUFFIX,iyes.youku.com",
  "DOMAIN-SUFFIX,l.ykimg.com",
  "DOMAIN-SUFFIX,l.youku.com",
  "DOMAIN-SUFFIX,lstat.youku.com",
  "DOMAIN-SUFFIX,lvip.youku.com",
  "DOMAIN-SUFFIX,mobilemsg.youku.com",
  "DOMAIN-SUFFIX,msg.youku.com",
  "DOMAIN-SUFFIX,myes.youku.com",
  "DOMAIN-SUFFIX,nstat.tudou.com",
  "DOMAIN-SUFFIX,p-log.ykimg.com",
  "DOMAIN-SUFFIX,p.l.ykimg.com",
  "DOMAIN-SUFFIX,p.l.youku.com",
  "DOMAIN-SUFFIX,passport-log.youku.com",
  "DOMAIN-SUFFIX,push.m.youku.com",
  "DOMAIN-SUFFIX,r.l.youku.com",
  "DOMAIN-SUFFIX,s.p.youku.com",
  "DOMAIN-SUFFIX,sdk.m.youku.com",
  "DOMAIN-SUFFIX,stat.tudou.com",
  "DOMAIN-SUFFIX,stat.youku.com",
  "DOMAIN-SUFFIX,stats.tudou.com",
  "DOMAIN-SUFFIX,store.tv.api.3g.youku.com",
  "DOMAIN-SUFFIX,store.xl.api.3g.youku.com",
  "DOMAIN-SUFFIX,tdrec.youku.com",
  "DOMAIN-SUFFIX,test.ott.youku.com",
  "DOMAIN-SUFFIX,v.l.youku.com",
  "DOMAIN-SUFFIX,val.api.youku.com",
  "DOMAIN-SUFFIX,wan.youku.com",
  "DOMAIN-SUFFIX,ykatr.youku.com",
  "DOMAIN-SUFFIX,ykrec.youku.com",
  "DOMAIN-SUFFIX,ykrectab.youku.com",
  "IP-CIDR,117.177.248.17/32,no-resolve",
  "IP-CIDR,117.177.248.41/32,no-resolve",
  "IP-CIDR,223.87.176.139/32,no-resolve",
  "IP-CIDR,223.87.176.176/32,no-resolve",
  "IP-CIDR,223.87.177.180/32,no-resolve",
  "IP-CIDR,223.87.177.182/32,no-resolve",
  "IP-CIDR,223.87.177.184/32,no-resolve",
  "IP-CIDR,223.87.177.43/32,no-resolve",
  "IP-CIDR,223.87.177.47/32,no-resolve",
  "IP-CIDR,223.87.177.80/32,no-resolve",
  "IP-CIDR,223.87.182.101/32,no-resolve",
  "IP-CIDR,223.87.182.102/32,no-resolve",
  "IP-CIDR,223.87.182.11/32,no-resolve",
  "IP-CIDR,223.87.182.52/32,no-resolve",
  "DOMAIN-SUFFIX,azabu-u.ac.jp",
  "DOMAIN-SUFFIX,couchcoaster.jp",
  "DOMAIN-SUFFIX,delivery.dmkt-sp.jp",
  "DOMAIN-SUFFIX,ehg-youtube.hitbox.com",
  "DOMAIN-SUFFIX,nichibenren.or.jp",
  "DOMAIN-SUFFIX,nicorette.co.kr",
  "DOMAIN-SUFFIX,ssl-youtube.2cnt.net",
  "DOMAIN-SUFFIX,youtube.112.2o7.net",
  "DOMAIN-SUFFIX,youtube.2cnt.net",
  "DOMAIN-SUFFIX,acsystem.wasu.tv",
  "DOMAIN-SUFFIX,ads.cdn.tvb.com",
  "DOMAIN-SUFFIX,ads.wasu.tv",
  "DOMAIN-SUFFIX,afp.wasu.tv",
  "DOMAIN-SUFFIX,c.algovid.com",
  "DOMAIN-SUFFIX,gg.jtertp.com",
  "DOMAIN-SUFFIX,gridsum-vd.cntv.cn",
  "DOMAIN-SUFFIX,kwflvcdn.000dn.com",
  "DOMAIN-SUFFIX,logstat.t.sfht.com",
  "DOMAIN-SUFFIX,match.rtbidder.net",
  "DOMAIN-SUFFIX,n-st.vip.com",
  "DOMAIN-SUFFIX,pop.uusee.com",
  "DOMAIN-SUFFIX,static.duoshuo.com",
  "DOMAIN-SUFFIX,t.cr-nielsen.com",
  "DOMAIN-SUFFIX,terren.cntv.cn",
  "DOMAIN-SUFFIX,1.win7china.com",
  "DOMAIN-SUFFIX,168.it168.com",
  "DOMAIN-SUFFIX,2.win7china.com",
  "DOMAIN-SUFFIX,801.tianya.cn",
  "DOMAIN-SUFFIX,801.tianyaui.cn",
  "DOMAIN-SUFFIX,803.tianya.cn",
  "DOMAIN-SUFFIX,803.tianyaui.cn",
  "DOMAIN-SUFFIX,806.tianya.cn",
  "DOMAIN-SUFFIX,806.tianyaui.cn",
  "DOMAIN-SUFFIX,808.tianya.cn",
  "DOMAIN-SUFFIX,808.tianyaui.cn",
  "DOMAIN-SUFFIX,92x.tumblr.com",
  "DOMAIN-SUFFIX,a1.itc.cn",
  "DOMAIN-SUFFIX,ad-channel.wikawika.xyz",
  "DOMAIN-SUFFIX,ad-display.wikawika.xyz",
  "DOMAIN-SUFFIX,ad.12306.cn",
  "DOMAIN-SUFFIX,ad.3.cn",
  "DOMAIN-SUFFIX,ad.95306.cn",
  "DOMAIN-SUFFIX,ad.caiyunapp.com",
  "DOMAIN-SUFFIX,ad.cctv.com",
  "DOMAIN-SUFFIX,ad.cmvideo.cn",
  "DOMAIN-SUFFIX,ad.csdn.net",
  "DOMAIN-SUFFIX,ad.ganji.com",
  "DOMAIN-SUFFIX,ad.house365.com",
  "DOMAIN-SUFFIX,ad.thepaper.cn",
  "DOMAIN-SUFFIX,ad.unimhk.com",
  "DOMAIN-SUFFIX,adadmin.house365.com",
  "DOMAIN-SUFFIX,adhome.1fangchan.com",
  "DOMAIN-SUFFIX,adm.10jqka.com.cn",
  "DOMAIN-SUFFIX,ads.csdn.net",
  "DOMAIN-SUFFIX,ads.feedly.com",
  "DOMAIN-SUFFIX,ads.genieessp.com",
  "DOMAIN-SUFFIX,ads.house365.com",
  "DOMAIN-SUFFIX,ads.linkedin.com",
  "DOMAIN-SUFFIX,adshownew.it168.com",
  "DOMAIN-SUFFIX,adv.ccb.com",
  "DOMAIN-SUFFIX,advert.api.thejoyrun.com",
  "DOMAIN-SUFFIX,analytics.ganji.com",
  "DOMAIN-SUFFIX,api-deal.kechenggezi.com",
  "DOMAIN-SUFFIX,api-z.weidian.com",
  "DOMAIN-SUFFIX,app-monitor.ele.me",
  "DOMAIN-SUFFIX,bat.bing.com",
  "DOMAIN-SUFFIX,bd1.52che.com",
  "DOMAIN-SUFFIX,bd2.52che.com",
  "DOMAIN-SUFFIX,bdj.tianya.cn",
  "DOMAIN-SUFFIX,bdj.tianyaui.cn",
  "DOMAIN-SUFFIX,beacon.tingyun.com",
  "DOMAIN-SUFFIX,cdn.jiuzhilan.com",
  "DOMAIN-SUFFIX,click.cheshi-img.com",
  "DOMAIN-SUFFIX,click.cheshi.com",
  "DOMAIN-SUFFIX,click.ganji.com",
  "DOMAIN-SUFFIX,click.tianya.cn",
  "DOMAIN-SUFFIX,click.tianyaui.cn",
  "DOMAIN-SUFFIX,client-api.ele.me",
  "DOMAIN-SUFFIX,collector.githubapp.com",
  "DOMAIN-SUFFIX,counter.csdn.net",
  "DOMAIN-SUFFIX,d0.xcar.com.cn",
  "DOMAIN-SUFFIX,de.soquair.com",
  "DOMAIN-SUFFIX,dol.tianya.cn",
  "DOMAIN-SUFFIX,dol.tianyaui.cn",
  "DOMAIN-SUFFIX,dw.xcar.com.cn",
  "DOMAIN-SUFFIX,e.nexac.com",
  "DOMAIN-SUFFIX,eq.10jqka.com.cn",
  "DOMAIN-SUFFIX,exp.17wo.cn",
  "DOMAIN-SUFFIX,game.51yund.com",
  "DOMAIN-SUFFIX,ganjituiguang.ganji.com",
  "DOMAIN-SUFFIX,grand.ele.me",
  "DOMAIN-SUFFIX,hosting.miarroba.info",
  "DOMAIN-SUFFIX,iadsdk.apple.com",
  "DOMAIN-SUFFIX,image.gentags.com",
  "DOMAIN-SUFFIX,its-dori.tumblr.com",
  "DOMAIN-SUFFIX,log.outbrain.com",
  "DOMAIN-SUFFIX,m.12306media.com",
  "DOMAIN-SUFFIX,media.cheshi-img.com",
  "DOMAIN-SUFFIX,media.cheshi.com",
  "DOMAIN-SUFFIX,mobile-pubt.ele.me",
  "DOMAIN-SUFFIX,mobileads.msn.com",
  "DOMAIN-SUFFIX,n.cosbot.cn",
  "DOMAIN-SUFFIX,newton-api.ele.me",
  "DOMAIN-SUFFIX,ozone.10jqka.com.cn",
  "DOMAIN-SUFFIX,pdl.gionee.com",
  "DOMAIN-SUFFIX,pica-juicy.picacomic.com",
  "DOMAIN-SUFFIX,pixel.wp.com",
  "DOMAIN-SUFFIX,pub.mop.com",
  "DOMAIN-SUFFIX,push.wandoujia.com",
  "DOMAIN-SUFFIX,pv.cheshi-img.com",
  "DOMAIN-SUFFIX,pv.cheshi.com",
  "DOMAIN-SUFFIX,pv.xcar.com.cn",
  "DOMAIN-SUFFIX,qdp.qidian.com",
  "DOMAIN-SUFFIX,res.gwifi.com.cn",
  "DOMAIN-SUFFIX,ssp.kssws.ks-cdn.com",
  "DOMAIN-SUFFIX,sta.ganji.com",
  "DOMAIN-SUFFIX,stat.10jqka.com.cn",
  "DOMAIN-SUFFIX,stat.it168.com",
  "DOMAIN-SUFFIX,stats.chinaz.com",
  "DOMAIN-SUFFIX,stats.developingperspective.com",
  "DOMAIN-SUFFIX,track.hujiang.com",
  "DOMAIN-SUFFIX,tracker.yhd.com",
  "DOMAIN-SUFFIX,tralog.ganji.com",
  "DOMAIN-SUFFIX,up.qingdaonews.com",
  "DOMAIN-SUFFIX,vaserviece.10jqka.com.cn",
]

const defaultArgs = {
  enable: true,
  ruleSet: 'all',
  regionSet: 'all',
  interfaceName: '',
  excludeHighPercentage: true,
  globalRatioLimit: 2,
  skipIps: _skipIps,
  defaultDNS: _chinaIpDns,
  directDNS: _chinaIpDns,
  chinaDNS: _chinaDohDns,
  foreignDNS: _foreignDohDns,
  dns: true,
  sniffer: false,
  mode: 'default',
  ipv6: false,
  logLevel: 'error',
  githubProxy: '',
}

let args = typeof $arguments !== 'undefined' ? $arguments : defaultArgs

args = {
  ...defaultArgs,
  ...Object.fromEntries(
    Object.entries(args)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        // 仅处理字符串类型
        if (typeof value === 'string') {
          const trimmed = value.trim()

          // 转换布尔字符串
          if (trimmed === 'true') return [key, true]
          if (trimmed === 'false') return [key, false]

          // 转换数字字符串（仅当字符串与数字的 toString() 完全一致时）
          if (trimmed !== '' && !isNaN(trimmed) && String(Number(trimmed)) === trimmed) {
            return [key, Number(trimmed)]
          }
        }
        return [key, value] // 保持原值
      })
  ),
}

/**
 * 如果是直接在软件中粘贴脚本的，就手动修改下面这几个变量实现自定义配置
 */
let {
  enable = args.enable || true,
  ruleSet = args.ruleSet || 'all', // 支持 'all' 或 'openai,youtube,ads' 这种格式
  regionSet = args.regionSet || 'all', // 匹配 regionDefinitions.name 前两个字母 (严格大小写)
  interfaceName = args.interfaceName || '',
  excludeHighPercentage = !!args.excludeHighPercentage || false,
  globalRatioLimit = args.globalRatioLimit || 2,
  skipIps = args.skipIps || _skipIps,
  defaultDNS = args.defaultDNS || _chinaIpDns,
  directDNS = args.directDNS || _chinaIpDns,
  chinaDNS = args.chinaDNS || _chinaDohDns,
  foreignDNS = args.foreignDNS || _foreignDohDns,
  dns = args.dns || false,
  sniffer = args.sniffer || false,
  mode = args.mode || '',
  ipv6 = args.ipv6 || false,
  logLevel = args.logLevel || 'error',
  githubProxy = args.githubProxy || '',
} = args

/**
 * 模式配置
 */
if (['securest', 'secure', 'default', 'fast', 'fastest'].includes(mode)) {
  switch (mode) {
    case 'securest':
      defaultDNS = _foreignIpDns
      directDNS = _foreignDohDns
      break
    case 'secure':
      defaultDNS = _foreignIpDns
      directDNS = _chinaDohDns
      chinaDNS = _chinaDohDns
      foreignDNS = _foreignDohDns
      break
    case 'fast':
      defaultDNS = _chinaIpDns
      directDNS = _chinaIpDns
      chinaDNS = _chinaIpDns
      foreignDNS = _chinaDohDns
      break
    case 'fastest':
      defaultDNS = _chinaIpDns
      directDNS = _chinaIpDns
      chinaDNS = _chinaIpDns
      foreignDNS = _chinaIpDns
      break
    default:
      defaultDNS = _chinaIpDns
      directDNS = _chinaIpDns
      chinaDNS = _chinaDohDns
      foreignDNS = _chinaDohDns
      break
  }
}

skipIps = stringToArray(skipIps)
defaultDNS = stringToArray(defaultDNS)
directDNS = stringToArray(directDNS)
chinaDNS = stringToArray(chinaDNS)
foreignDNS = stringToArray(foreignDNS)

/**
 * 分流规则配置，会自动生成对应的策略组
 * 设置的时候可遵循“最小，可用”原则，把自己不需要的规则全禁用掉，提高效率
 * true = 启用
 * false = 禁用
 */
let ruleOptions = {
  apple: false,
  microsoft: false,
  github: false,
  google: false,
  googleai: false,
  openai: false,
  spotify: false,
  youtube: false,
  bahamut: false,
  netflix: false,
  tiktok: false,
  disney: false,
  pixiv: false,
  hbo: false,
  mediaHMT: false,
  biliintl: false,
  tvb: false,
  hulu: false,
  primevideo: false,
  telegram: false,
  line: false,
  whatsapp: false,
  games: false,
  japan: false,
  ads: false,
}

if (ruleSet === 'all') {
  Object.keys(ruleOptions).forEach((key) => (ruleOptions[key] = true))
} else if (typeof ruleSet === 'string') {
  const enabledKeys = ruleSet.split(';').map((s) => s.trim())
  enabledKeys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(ruleOptions, key)) {
      ruleOptions[key] = true
    }
  })
}

// 初始规则
const _initialRules = [
  'DST-PORT,22,直连', // Git SSH（必须放首位，防止密钥协商失败）
  'DST-PORT,3389,直连', // Windows远程连接
  'DST-PORT,5938,直连', // TeamViewer（核心端口，含TCP/UDP）
  'DST-PORT,7070,直连', // AnyDesk（主端口，含TCP/UDP音视频流）
  'DST-PORT,19966,直连', // 向日葵远程控制
  'DST-PORT,21114-21119,直连', // RustDesk（含WebSocket中继端口）
  'DST-PORT,4118,直连', // 蒲公英P2P穿透
  'DST-PORT,7654,直连', // N2N SuperNode端口
  'DST-PORT,9118,直连', // 节点小宝端口
  'DST-PORT,50000-50100,直连', // AnyDesk/RustDesk备用中继端口（关键！）
  'DST-PORT,5353,直连', // 向日葵内网穿透
  'GEOSITE,category-collaborate-cn,直连',
  'GEOSITE,category-container,手动选择',
  // 'GEOSITE,category-netdisk-!cn,手动选择',
  'RULE-SET,applications,下载软件',
]

// fork: 每次 main() 调用都要回到初始副本，否则切订阅会累加规则
const rules = [..._initialRules]

// 地区定义 (Icons 更新为 GitHub Raw)
const allRegionDefinitions = [
  {
    name: 'HK香港',
    regex: /港|🇭🇰|hk|hongkong|hong kong/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hong_Kong.png',
  },
  {
    name: 'US美国',
    regex: /(?!.*aus)(?=.*(美|🇺🇸|us(?!t)|usa|american|united states)).*/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_States.png',
  },
  {
    name: 'JP日本',
    regex: /日本|🇯🇵|jp|japan/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Japan.png',
  },
  {
    name: 'KR韩国',
    regex: /韩|🇰🇷|kr|korea/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Korea.png',
  },
  {
    name: 'SG新加坡',
    regex: /新加坡|🇸🇬|sg|singapore/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Singapore.png',
  },
  {
    name: 'CN中国大陆',
    // fork: 原 /中国|🇨🇳|cn|china/ 会让「🇨🇳 台湾 03」这类旗标节点被误判进大陆组。
    // 要求 cn 为独立词，并排除含台/港/澳的节点名（它们有各自的分组）。
    regex: /^(?=.*(?:中国|🇨🇳|\bcn\b|china))(?!.*(?:台|台|港|澳|taiwan|hong ?kong|macau)).*/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China_Map.png',
  },
  {
    name: 'TW台湾',
    regex: /台湾|台灣|🇹🇼|tw|taiwan|tai wan/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/China.png',
  },
  {
    name: 'GB英国',
    regex: /英|🇬🇧|uk|united kingdom|great britain/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/United_Kingdom.png',
  },
  {
    name: 'DE德国',
    regex: /德国|🇩🇪|de|germany/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Germany.png',
  },
  {
    name: 'MY马来西亚',
    regex: /马来|🇲🇾|my|malaysia/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Malaysia.png',
  },
  {
    name: 'TK土耳其',
    regex: /土耳其|🇹🇷|tk|turkey/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Turkey.png',
  },
  {
    name: 'CA加拿大',
    regex: /加拿大|🇨🇦|ca|canada/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Canada.png',
  },
  {
    name: 'AU澳大利亚',
    regex: /澳大利亚|🇦🇺|au|australia|sydney/i,
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Australia.png',
  },
]

let regionDefinitions = []
if (regionSet === 'all') {
  regionDefinitions = allRegionDefinitions
} else {
  const enabledRegions = regionSet.split(';').map((s) => s.trim())
  regionDefinitions = allRegionDefinitions.filter((r) => {
    const prefix = r.name.substring(0, 2) // 获取前两个字母
    return enabledRegions.includes(prefix)
  })
}

const dnsConfig = {
  enable: !!dns,
  listen: '0.0.0.0:1053',
  ipv6: !!ipv6,
  'log-level': logLevel,
  'prefer-h3': false,
  'use-hosts': true,
  'use-system-hosts': true,
  'respect-rules': true,
  'enhanced-mode': 'fake-ip',
  'fake-ip-range': '198.18.0.0/16',
  'fake-ip-filter-mode': 'whitelist',
  'fake-ip-filter': [
    'geosite:jetbrains-ai',
    'geosite:category-ai-!cn',
    'geosite:category-ai-chat-!cn',
    'geosite:category-games-!cn',
    'geosite:category-cdn-!cn',
    'geosite:telegram',
    // 'geosite:x',
    'geosite:google',
    'geosite:amazon',
    'geosite:category-bank-jp',
    'geosite:category-communication',
    'geosite:gfw',
    // 'geosite:geolocation-!cn',
  ],
  nameserver: chinaDNS,
  'default-nameserver': defaultDNS,
  'direct-nameserver': directDNS,
  // fallback: foreignDNS,
  // 'fallback-filter': {
  //   geoip: true,
  //   'geoip-code': 'CN',
  // },
  'proxy-server-nameserver': chinaDNS,
  'nameserver-policy': {
    'geosite:private': 'system',
    'geosite:tld-cn,cn,steam@cn,category-games@cn,microsoft@cn,category-game-platforms-download@cn,category-public-tracker':
      chinaDNS,
    'geosite:gfw,jetbrains-ai,category-ai-!cn,category-ai-chat-!cn': foreignDNS,
    // 'geosite:telegram': foreignDNS,
  },
}

// 通用配置
const ruleProviderCommon = {
  type: 'http',
  format: 'yaml',
  interval: 86400,
}
const groupBaseOption = {
  interval: 300,
  // 2026-11-18：3000ms 贴着节点劣化的真实延迟，会被误判成失败；放宽到 5000ms。
  timeout: 5000,
  url: 'https://www.gstatic.com/generate_204',
  lazy: true,
  'max-failed-times': 3,
  hidden: false,
}

// 预定义 Rule Providers
const ruleProviders = {
  applications: {
    ...ruleProviderCommon,
    behavior: 'classical',
    format: 'text',
    url: 'https://github.com/DustinWin/ruleset_geodata/raw/refs/heads/mihomo-ruleset/applications.list',
    path: './ruleset/DustinWin/applications.list',
  },
  // 2026-11-22: blackmatrix7 WeChat 规则集（8 DOMAIN + 22 DOMAIN-SUFFIX + IP-ASN,132203）。
  // 换成上游维护后微信域名与腾讯 ASN 段不再手工跟进；上游每日重建该 list。
  wechat: {
    ...ruleProviderCommon,
    behavior: 'classical',
    format: 'text',
    url: 'https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/WeChat/WeChat.list',
    path: './ruleset/blackmatrix7/WeChat.list',
  },
}

// 倍率正则预编译
const multiplierRegex = /(?<=[xX✕✖⨉倍率])([1-9]+(\.\d+)*|0{1}\.\d+)(?=[xX✕✖⨉倍率])*/i

// --- 2. 服务规则数据结构 ---
// Icons 更新为 GitHub Raw
const serviceConfigs = [
  // 2026-11-22 fork: 谷歌AI独立分流。必须排在 openai（category-ai-!cn 会兜走
  // gemini/antigravity）与 google（GEOSITE,google 会兜走 googleapis.com）之前，
  // 否则规则首条命中、独立组永远不生效。antigravity 域名 geosite 里没有完整集合
  // （antigravity.google / antigravity-unleash.goog / antigravity-pa.googleapis.com /
  // cloudcode-pa.googleapis.com 等），用 DOMAIN 明确列出。
  {
    key: 'googleai',
    name: '谷歌AI',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Google.png',
    url: 'https://gemini.google.com/',
    // 2026-11-22: 规则源改为 my-scripts 公开仓库（手机端 Stash/Shadowrocket 同源引用）
    rules: ['RULE-SET,google-ai,谷歌AI'],
    providers: [
      {
        key: 'google-ai',
        url: 'https://raw.githubusercontent.com/peanutgao/my-scripts/main/clash-rules/google-ai.list',
        path: './ruleset/my-scripts/google-ai.list',
        format: 'text',
        behavior: 'classical',
      },
    ],
  },
  {
    key: 'openai',
    name: '国外AI',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/ChatGPT.png',
    url: 'https://chat.openai.com/cdn-cgi/trace',
    rules: [
      'GEOSITE,jetbrains-ai,国外AI',
      'GEOSITE,category-ai-!cn,国外AI',
      'GEOSITE,category-ai-chat-!cn,国外AI',
      'DOMAIN-SUFFIX,meta.ai,国外AI',
      'DOMAIN-SUFFIX,meta.com,国外AI',
    ],
  },
  {
    key: 'youtube',
    name: 'YouTube',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/YouTube.png',
    url: 'https://www.youtube.com/s/desktop/494dd881/img/favicon.ico',
    rules: ['GEOSITE,youtube,YouTube'],
  },
  {
    key: 'mediaHMT',
    name: '港澳台媒体',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/TVB.png',
    url: 'https://viu.tv/',
    rules: ['RULE-SET,hk-media,港澳台媒体', 'RULE-SET,tw-media,港澳台媒体'],
    providers: [
      {
        key: 'hk-media',
        url: 'https://ruleset.skk.moe/Clash/non_ip/stream_hk.txt',
        path: './ruleset/ruleset.skk.moe/stream_hk.txt',
        format: 'text',
        behavior: 'classical',
      },
      {
        key: 'tw-media',
        url: 'https://ruleset.skk.moe/Clash/non_ip/stream_tw.txt',
        path: './ruleset/ruleset.skk.moe/stream_tw.txt',
        format: 'text',
        behavior: 'classical',
      },
    ],
  },
  {
    key: 'biliintl',
    name: '哔哩哔哩东南亚',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/bilibili_3.png',
    url: 'https://www.bilibili.tv/',
    rules: ['GEOSITE,biliintl,哔哩哔哩东南亚'],
  },
  {
    key: 'bahamut',
    name: '巴哈姆特',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Bahamut.png',
    url: 'https://ani.gamer.com.tw/ajax/getdeviceid.php',
    rules: ['GEOSITE,bahamut,巴哈姆特'],
  },
  {
    key: 'disney',
    name: 'Disney+',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Disney+.png',
    url: 'https://disney.api.edge.bamgrid.com/devices',
    rules: ['GEOSITE,disney,Disney+'],
  },
  {
    key: 'netflix',
    name: 'NETFLIX',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Netflix.png',
    url: 'https://api.fast.com/netflix/speedtest/v2?https=true',
    rules: ['GEOSITE,netflix,NETFLIX'],
  },
  {
    key: 'tiktok',
    name: 'Tiktok',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/TikTok.png',
    url: 'https://www.tiktok.com/',
    rules: ['GEOSITE,tiktok,Tiktok'],
  },
  {
    key: 'spotify',
    name: 'Spotify',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Spotify.png',
    url: 'https://spclient.wg.spotify.com/signup/public/v1/account',
    rules: ['GEOSITE,spotify,Spotify'],
  },
  {
    key: 'pixiv',
    name: 'Pixiv',
    icon: 'https://play-lh.googleusercontent.com/8pFuLOHF62ADcN0ISUAyEueA5G8IF49mX_6Az6pQNtokNVHxIVbS1L2NM62H-k02rLM=w240-h480-rw',
    url: 'http://spclient.wg.spotify.com/signup/public/v1/account',
    rules: ['GEOSITE,pixiv,Pixiv'],
  },
  {
    key: 'hbo',
    name: 'HBO',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/HBO.png',
    url: 'https://www.hbo.com/favicon.ico',
    rules: ['GEOSITE,hbo,HBO'],
  },
  {
    key: 'primevideo',
    name: 'Prime Video',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Prime_Video.png',
    url: 'https://m.media-amazon.com/images/G/01/digital/video/web/logo-min-remaster.png',
    rules: ['GEOSITE,primevideo,Prime Video'],
  },
  {
    key: 'hulu',
    name: 'Hulu',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Hulu.png',
    url: 'https://auth.hulu.com/v4/web/password/authenticate',
    rules: ['GEOSITE,hulu,Hulu'],
  },
  {
    key: 'telegram',
    name: 'Telegram',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Telegram.png',
    url: 'https://www.telegram.org/img/website_icon.svg',
    rules: ['GEOIP,telegram,Telegram'],
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    icon: 'https://static.whatsapp.net/rsrc.php/v3/yP/r/rYZqPCBaG70.png',
    url: 'https://web.whatsapp.com/data/manifest.json',
    rules: ['GEOSITE,whatsapp,WhatsApp'],
  },
  {
    key: 'line',
    name: 'Line',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Line.png',
    url: 'https://line.me/page-data/app-data.json',
    rules: ['GEOSITE,line,Line'],
  },
  {
    key: 'games',
    name: '游戏专用',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Game.png',
    rules: ['GEOSITE,category-games@cn,国内网站', 'GEOSITE,category-games,游戏专用'],
  },
  {
    key: 'ads',
    name: '广告过滤',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Advertising.png',
    rules: ['GEOSITE,category-ads-all,广告过滤', 'RULE-SET,adblockmihomo,广告过滤'],
    providers: [
      {
        key: 'adblockmihomo',
        url: 'https://github.com/217heidai/adblockfilters/raw/refs/heads/main/rules/adblockmihomo.mrs',
        path: './ruleset/adblockfilters/adblockmihomo.mrs',
        format: 'mrs',
        behavior: 'domain',
      },
    ],
    reject: true,
  },
  {
    key: 'apple',
    name: '苹果服务',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Apple_2.png',
    url: 'https://www.apple.com/library/test/success.html',
    rules: ['GEOSITE,apple-cn,苹果服务'],
  },
  {
    key: 'google',
    name: '谷歌服务',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Google_Search.png',
    url: 'https://www.google.com/generate_204',
    rules: ['GEOSITE,google,谷歌服务'],
  },
  {
    key: 'github',
    name: 'Github',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/GitHub.png',
    url: 'https://github.com/robots.txt',
    rules: ['GEOSITE,github,Github'],
  },
  {
    key: 'microsoft',
    name: '微软服务',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Microsoft.png',
    url: 'https://www.msftconnecttest.com/connecttest.txt',
    rules: ['GEOSITE,microsoft@cn,国内网站', 'GEOSITE,microsoft,微软服务'],
  },
  {
    key: 'japan',
    name: '日本网站',
    icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/JP.png',
    url: 'https://r.r10s.jp/com/img/home/logo/touch.png',
    rules: ['RULE-SET,category-bank-jp,日本网站', 'GEOIP,jp,日本网站,no-resolve'],
    providers: [
      {
        key: 'category-bank-jp',
        url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-bank-jp.mrs',
        path: './ruleset/MetaCubeX/category-bank-jp.mrs',
        format: 'mrs',
        behavior: 'domain',
      },
    ],
  },
]

// --- 3. 主入口 ---

function main(config) {
  if (!enable) return config

  rules.length = 0
  rules.push(..._initialRules)

  const proxies = config?.proxies || []
  const proxyCount = proxies.length
  const proxyProviderCount =
    typeof config?.['proxy-providers'] === 'object' ? Object.keys(config['proxy-providers']).length : 0

  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error('配置文件中未找到任何代理')
  }

  // 3.1 基础配置
  // fork 差异：上游在这里整体接管网络基础设施（端口/控制器/TUN/DNS/NTP/external-ui）。
  // 本机这些值由 Clash Verge 注入且被依赖：mixed-port 6152（系统代理、Revix 下载）、
  // TUN utun1024（OrbStack VM 外层链路）、unix socket 控制器（Verge 自身）。
  // 默认只取分流语义，基础设施交回 Verge；改 true 可恢复上游行为。
  const INFRASTRUCTURE_TAKEOVER = false

  if (INFRASTRUCTURE_TAKEOVER) {
    // 3.1 覆盖基础配置
    config['allow-lan'] = true
    config['bind-address'] = '*'
    config['mode'] = 'rule'
    config['ipv6'] = !!ipv6
    config['external-controller'] = '127.0.0.1:9090'
    config['external-controller-cors'] = {
      'allow-origins': ['*'],
      'allow-private-network': true,
    }
    config['secret'] = 'YaNet'
    config['port'] = 7890
    config['socks-port'] = 7891
    config['mixed-port'] = 7892
    config['redir-port'] = 7893
    config['tproxy-port'] = 7894
    config['external-ui'] = 'ui'
    config['external-ui-url'] = `${githubProxy}https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip`
    if (config.dns?.['proxy-server-nameserver']) {
      dnsConfig['proxy-server-nameserver'] = config.dns?.['proxy-server-nameserver']
    }
    if (config.dns?.['proxy-server-nameserver-policy']) {
      dnsConfig['proxy-server-nameserver-policy'] = config.dns?.['proxy-server-nameserver-policy']
    }
    config['dns'] = dnsConfig
    config['profile'] = {
      'store-selected': true,
      'store-fake-ip': true,
    }
    config['unified-delay'] = true
    config['tcp-concurrent'] = true
    config['keep-alive-interval'] = 1800
    config['find-process-mode'] = 'strict'
    config['geodata-mode'] = false
    config['geodata-loader'] = 'memconservative'
    config['geo-auto-update'] = true
    config['geo-update-interval'] = 24

    if (interfaceName.length > 0) {
      config['interface-name'] = interfaceName
    }

    if (INFRASTRUCTURE_TAKEOVER) {
    config['sniffer'] = {
        enable: sniffer,
        'force-dns-mapping': true,
        'parse-pure-ip': true,
        'override-destination': true,
        sniff: {
          TLS: {
            ports: [443, 8443],
          },
          HTTP: {
            ports: [80, '8080-8880'],
          },
          QUIC: {
            ports: [443, 8443],
          },
        },
        'skip-src-address': skipIps.filter((ip) => ip !== '198.18.0.0/16'),
        // 'skip-dst-address': skipIps,
        // 'force-domain': [
        //   '+.google.com',
        //   '+.googleapis.com',
        //   '+.googleusercontent.com',
        //   '+.youtube.com',
        //   '+.facebook.com',
        //   '+.messenger.com',
        //   '+.fbcdn.net',
        //   'fbcdn-a.akamaihd.net',
        // ],
        'skip-domain': ['Mijia Cloud', '+.oray.com'],
      }
  }

    if (INFRASTRUCTURE_TAKEOVER) {
    config['ntp'] = {
        enable: true,
        'write-to-system': false,
        server: 'cn.ntp.org.cn',
      }
  }
    if (INFRASTRUCTURE_TAKEOVER) {
    config['tun'] = {
        enable: true,
        stack: 'mixed',
        device: 'utun1999',
        'auto-route': true,
        'auto-redirect': true,
        'auto-detect-interface': true,
        'strict-route': true,
        mtu: 1500,
        gso: true,
        'gso-max-size': 65536,
        'exclude-interface': ['NodeBabyLink'],
        'route-exclude-address': skipIps.filter((ip) => ip !== '198.18.0.0/16'),
        'dns-hijack': ['any:53', 'tcp://any:53'],
      }
  }
    if (INFRASTRUCTURE_TAKEOVER) {
    config['geox-url'] = {
        geoip: `${githubProxy}https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat`,
        geosite: `${githubProxy}https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat`,
        mmdb: `${githubProxy}https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip.metadb`,
        asn: `${githubProxy}https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/GeoLite2-ASN.mmdb`,
      }
  }

  }

  // fork: 订阅自带节点里可能有同名「直连」（MyDedione 就有），直接 push 会撞名、
  // 导致整份配置校验失败。先删同名项，再补本脚本需要的两个内置出口。
  for (const reserved of ['直连', '拒绝']) {
    const index = config.proxies.findIndex((p) => p && p.name === reserved)
    if (index !== -1) config.proxies.splice(index, 1)
  }

  config.proxies.push({
    name: '直连',
    type: 'direct',
    udp: true,
    'routing-mark': 5555,
  })

  config.proxies.push({
    name: '拒绝',
    type: 'reject',
    udp: false,
  })

  // fork: 供「自动选择」与「手动选择」使用的可用节点名列表。
  // 与地区归类采用同一套过滤（跳过倍率超限的节点），保证两边一致。
  const proxyNames = proxies
    .map((p) => (p && typeof p.name === 'string' ? p.name : ''))
    .filter(Boolean)
    .filter((name) => {
      if (!excludeHighPercentage) return true
      const match = multiplierRegex.exec(name)
      return !(match && parseFloat(match[1]) > globalRatioLimit)
    })
    .filter((name) => name !== '直连' && name !== '拒绝')

  // 3.2 高效代理分类 (单次遍历)
  const regionGroups = {}
  regionDefinitions.forEach(
    (r) =>
      (regionGroups[r.name] = {
        ...r,
        proxies: [],
      })
  )
  const otherProxies = []

  for (let i = 0; i < proxyCount; i++) {
    const proxy = proxies[i]
    const name = proxy.name
    let matched = false

    // 检查倍率
    if (excludeHighPercentage) {
      const match = multiplierRegex.exec(name)
      if (match && parseFloat(match[1]) > globalRatioLimit) {
        continue
      }
    }

    // 尝试匹配地区
    for (const region of regionDefinitions) {
      if (region.regex.test(name)) {
        regionGroups[region.name].proxies.push(name)
        matched = true
        break
      }
    }

    if (!matched) {
      otherProxies.push(name)
    }
  }

  const generatedRegionGroups = []
  regionDefinitions.forEach((r) => {
    const groupData = regionGroups[r.name]
    if (groupData.proxies.length > 0) {
      generatedRegionGroups.push({
        ...groupBaseOption,
        name: r.name,
        type: 'url-test',
        tolerance: 50,
        icon: r.icon,
        proxies: groupData.proxies,
      })
    }
  })

  const regionGroupNames = generatedRegionGroups.map((g) => g.name).sort()

  // fork: 顶层「自动选择」= 全部节点的 url-test，对应原订阅的「自动选择」组。
  // 地区组本身也是 url-test，所以「选国家」依旧是自动测速；
  // 而「手动选择」里同时列出具体节点，保留手动指定单个节点的能力。
  const autoSelectGroup =
    proxyNames.length > 0
      ? [
          {
            ...groupBaseOption,
            name: '自动选择',
            type: 'url-test',
            tolerance: 50,
            proxies: [...proxyNames],
            icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Auto.png',
          },
        ]
      : []

  // fork:「其他节点」不再混进地区组列表，单独存放——顶层组顺序里排在功能组之后。
  const otherNodeGroup =
    otherProxies.length > 0
      ? [
          {
            ...groupBaseOption,
            name: '其他节点',
            type: 'select',
            proxies: otherProxies,
            icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/World_Map.png',
          },
        ]
      : []

  // 3.3 构建功能策略组
  const functionalGroups = []

  // fork:「手动选择」独立于功能组——顶层顺序里紧跟「自动选择」（2026-11-18）。
  const manualSelectGroup = [
    {
      ...groupBaseOption,
      name: '手动选择',
      type: 'select',
      // 成员顺序：自动选择 → 地区组（自动测速）→ 其他节点 → 各个具体节点 → 直连。
      // 具体节点放在地区组之后，既保留「先按国家自动选」，也能像原订阅那样手动钉死单个节点。
      proxies: [
        ...autoSelectGroup.map((g) => g.name),
        ...regionGroupNames,
        ...(otherProxies.length > 0 ? ['其他节点'] : []),
        ...proxyNames,
        '直连',
      ],
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png',
    },
  ]

  serviceConfigs.forEach((svc) => {
    if (ruleOptions[svc.key]) {
      rules.push(...svc.rules)

      if (Array.isArray(svc.providers)) {
        svc.providers.forEach((p) => {
          ruleProviders[p.key] = {
            ...ruleProviderCommon,
            behavior: p.behavior,
            format: p.format,
            url: p.url,
            path: p.path,
          }
        })
      }

      let groupProxies
      if (svc.reject) {
        groupProxies = ['拒绝', '直连', '手动选择']
      } else if (svc.key === 'apple') {
        // 2026-11-18：Apple 服务一律直连，避免代理出口打断下载会话与商店接口。
        groupProxies = ['直连']
      } else if (svc.key === 'biliintl' || svc.key === 'bahamut') {
        groupProxies = ['手动选择', '直连', ...regionGroupNames]
      } else if (svc.key === 'googleai') {
        // fork: 谷歌AI对非美出口限制最多（Gemini/Antigravity 地区封锁清单以美国最全），
        // 组成员美国排最前，select 组默认取第一项，重新合成后自动落美国节点。
        const usFirst = [...regionGroupNames].sort((a, b) => {
          const rank = (n) => (/US/i.test(n) ? 0 : 1)
          return rank(a) - rank(b)
        })
        groupProxies = ['手动选择', ...usFirst, '直连']
      } else {
        groupProxies = ['手动选择', ...regionGroupNames, '直连']
      }

      functionalGroups.push({
        ...groupBaseOption,
        name: svc.name,
        type: 'select',
        proxies: groupProxies,
        url: svc.url,
        icon: svc.icon,
      })
    }
  })

  // 3.4 fork 自定义增量
  // (a) OrbStack 外层隧道直连：VM 的机场连接不能被宿主机节点二次代理。
  //     2026-11-10 实测：缺这条 74 条候选只剩 5 条健康、切换 30.6s；补上 51 条健康、6.9s。
  rules.unshift(
    'PROCESS-PATH,/Applications/OrbStack.app/Contents/Frameworks/OrbStack Helper.app/Contents/MacOS/OrbStack Helper,直连'
  )

  // (b) dedione 拦截规则（广告 + 应用净化），目标统一为「拒绝」。
  //     category-ads-all 由上游 serviceConfigs 的 ads 项负责，此处不重复。
  //     注意 IP-CIDR 的 no-resolve 必须排在组名之后：rule,参数,组名,no-resolve
  const _withReject = (ruleset) =>
    ruleset.map((rule) => {
      const parts = rule.split(',')
      const tail = parts[parts.length - 1].trim()
      return tail === 'no-resolve' ? `${parts.slice(0, -1).join(',')},拒绝,no-resolve` : `${rule},拒绝`
    })
  rules.push(..._withReject(_dedioneAds), ..._withReject(_dedionePurify))

  // (c) App Store：availableStoreFronts 对 CN/HK 出口 404，只有日本/美国 200。
  //     按节点名动态建组；无日本/美国节点时整体跳过，避免规则悬空导致配置报废。
  const appStoreNodes = (() => {
    const names = proxies.map((p) => (p && typeof p.name === 'string' ? p.name : '')).filter(Boolean)
    const jp = names.filter((n) => /日本|japan|🇯🇵/i.test(n))
    const us = names.filter((n) => /美国|united ?states|🇺🇸/i.test(n))
    const base = jp.length > 0 ? jp : us
    // 稳定节点排首位：组选择在 Verge 重新合成时可能被重置，此时默认落列表第一项。
    // storefront 5/5 稳定的 IEPL/专线节点优先（2026-11-17 实测），普通节点殿后。
    const rank = (n) => (/IEPL|专线|iepl/i.test(n) ? 0 : 1)
    return [...base].sort((a, b) => rank(a) - rank(b))
  })()

  if (appStoreNodes.length > 0) {
    // 插在 OrbStack 直连之后、其余规则之前：进程级直连优先级始终最高。
    const orbStackIndex = rules.findIndex((r) => r.includes('OrbStack Helper'))
    const at = orbStackIndex >= 0 ? orbStackIndex + 1 : 0
    // CDN 大文件域先于 API 域。2026-11-17 实测：直连 CDN 入口对真实文件请求
    // （带签名 accessKey 的 GET）超时，只能走代理；大文件中途 EOF 是节点问题，
    // 通过选稳定节点（IEPL）解决，而不是把 CDN 指向直连。
    // 2026-11-18：Apple 官方域名一律直连，绝不进代理。
    // 代理出口会改写下载会话绑定的出口 IP，出现 storefront 404 / redownload 403 / 中途 EOF。
    // 只列商店与 CDN 真正用到的域名：apple.com 整域直连会连带影响 iCloud、
    // 推送等需要代理的 Apple 服务，范围要收窄。
    rules.splice(
      at,
      0,
      'DOMAIN,adsdk.apple.com,拒绝',
      'DOMAIN-SUFFIX,mzstatic.com,直连',
      'DOMAIN,iosapps.itunes.apple.com,直连',
      'DOMAIN-SUFFIX,itunes.apple.com,直连',
      'DOMAIN-SUFFIX,itunes.com,直连',
      'DOMAIN-SUFFIX,appldnld.apple.com,直连',
      'DOMAIN,xp.apple.com,直连',
      'DOMAIN-SUFFIX,aaplimg.com,直连'
    )
    functionalGroups.unshift({
      ...groupBaseOption,
      name: 'App Store',
      // 必须是 select（单出口）而不是 fallback/url-test：Apple 下载会话 token 绑定出口 IP，
      // 组内任何自动切换都会让同一会话跨出口 → AMS 301 / HTTP 403（2026-11-17 实测，
      // fallback 120s 健康检查期间组内漂移导致组件报 redownload 403）。
      // 健康检查仍探 storefront 端点（CN/HK 出口 404 判失败），只用于 Verge 面板显示，
      // 不自动切换：节点坏了用户在面板手动换，换来的是会话全程出口稳定。
      type: 'select',
      url: 'https://itunes.apple.com/WebObjects/MZStore.woa/wa/availableStoreFronts',
      interval: 300,
      // IEPL 专线排最前：storefront 5/5 稳定（普通节点 2~3/5 间歇 EOF）。
      // select 组默认取第一项，重启/重新合成后自动回到专线。
      proxies: ['直连'],
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Apple.png',
    })
  }

  // 3.5 微信/腾讯直连：改用 blackmatrix7 WeChat 规则集（上游自动更新，免自维护）。
  //     背景：微信客户端对海外 CDN（Tencent Cloud 国际段）走裸 IP、无 SNI，域名规则
  //     接不住；这些 IP 在 mmdb 里判为 SG/HK/US，GEOIP,cn 不含，命中兜底 MATCH →
  //     其他外网 → 美国节点（2026-11-22 实测 43.130.30.185:8080 → 美国 04）。
  //     该规则集 = 8 DOMAIN + 22 DOMAIN-SUFFIX + IP-ASN,132203（社区标准做法，
  //     与本 fork 此前手写的 IP-ASN,132203 一致）。classical text provider 直接吃
  //     这种带类型前缀的 .list；RULE-SET 放 GEOIP,cn 之前。上游更新 interval 86400。
  rules.push('RULE-SET,wechat,直连')

  // 3.5 添加通用兜底策略组
  rules.push(
    'GEOSITE,private,直连',
    'GEOSITE,category-public-tracker,直连',
    'GEOSITE,category-game-platforms-download@cn,直连',
    'GEOSITE,category-remote-control,直连',
    'GEOIP,private,直连,no-resolve',
    'GEOSITE,cn,直连',
    'GEOIP,cn,直连,no-resolve',
    // 'GEOSITE,geolocation-!cn,其他外网',
    'MATCH,其他外网'
  )

  functionalGroups.push(
    {
      ...groupBaseOption,
      name: '下载软件',
      type: 'select',
      proxies: ['直连', '拒绝', '手动选择', '国内网站', ...regionGroupNames],
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Download.png',
    },
    {
      ...groupBaseOption,
      name: '其他外网',
      type: 'select',
      proxies: ['手动选择', '国内网站', ...regionGroupNames],
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Streaming!CN.png',
      rules: ['GEOSITE,geolocation-!cn,其他外网'],
    },
    {
      ...groupBaseOption,
      name: '国内网站',
      type: 'select',
      proxies: ['直连', '手动选择', ...regionGroupNames],
      url: 'https://wifi.vivo.com.cn/generate_204',
      icon: 'https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/StreamingCN.png',
    }
  )

  // 3.5 fork: 保留 dialer-proxy 依赖的原始分组
  // 订阅可能用 dialer-proxy 把节点串成「中转 → 落地」链（MyDedione 有 147 条），
  // 目标常是原配置里的分组名。YaNet 重建 proxy-groups 会让这些组消失，导致
  // 内核报 `dialer-proxy [...] not found` 而整份配置校验失败。
  // 这里把被引用的原始组原样保留，其余分组仍由 YaNet 接管。
  const originalGroups = Array.isArray(config['proxy-groups']) ? config['proxy-groups'] : []
  const dialerTargets = new Set(
    (config.proxies || []).map((p) => p && p['dialer-proxy']).filter((v) => typeof v === 'string')
  )
  const preservedGroups = originalGroups.filter((g) => g && dialerTargets.has(g.name))

  // 3.6 组装最终结果
  // 2026-11-18：顺序为 自动选择 → 手动选择 → 地区组（国家）→ 功能组（国外AI/YouTube 等）
  // → 其他节点 → dialer 保留组。
  config['proxy-groups'] = [
    ...autoSelectGroup,
    ...manualSelectGroup,
    ...generatedRegionGroups.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })),
    ...functionalGroups,
    ...otherNodeGroup,
    ...preservedGroups,
  ]

  config['rules'] = rules
  config['rule-providers'] = ruleProviders

  return config
}
