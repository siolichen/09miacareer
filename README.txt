第二職涯研究室 — WordPress 匯入說明
====================================

為什麼原本的檔案在 WordPress 會少東西
------------------------------------
原始 .dc.html 依賴一支外部程式（support.js）在瀏覽器端組出畫面，
而且捲動動效的區塊（例如「你也這樣想嗎？」三個痛點卡）預設是 opacity:0，
要等那支程式跑起來才會淡入。
WordPress 編輯器與多數佈景會過濾掉自訂標籤與 <script>，
程式沒跑 → 那些區塊永遠停在透明狀態 → 看起來就是「不見了」。

這個資料夾做了什麼
------------------
1. 全部改成純 HTML，不再需要 support.js。
2. 動效改成「預設看得見」，只有在 JS 有跑時才加上動畫；
   即使 WordPress 擋掉 JS，內容一樣完整顯示。
3. hover 效果改寫成正規 CSS，不再依賴自訂屬性。
4. 表單、漢堡選單、數字動畫、卡片堆疊改寫成一支 assets/site.js。

上傳方式（擇一）
----------------
A. 直接放主機（最簡單、外觀 100% 相同）
   用 FTP 或主機檔案管理員，把整個資料夾內容上傳到網站根目錄。
   首頁即 index.html。

B. 放進 WordPress 頁面
   1) 先把 assets/ 整個資料夾上傳到主機（例如 /wp-content/uploads/scl/assets/）。
   2) 每頁的 <body> 內容貼進「自訂 HTML」區塊。
   3) <head> 內的 <style> 內容貼到「外觀 → 自訂 → 額外 CSS」。
   4) 用 WPCode 之類的外掛，在頁尾載入 assets/site.js。
   5) 頁面內的 assets/xxx.webp 路徑要改成步驟 1 的實際網址。

檔案對照
--------
index.html                     首頁
about.html                     關於米雅
blog.html                      第二職涯筆記（文章總覽）
article-40-career-change.html  文章一
article-why-quit.html          文章二
article-before-104.html        文章三
live.html                      直播報名（含個資告知）
robots.txt / sitemap.xml       上線前請把網域換成實際網址
