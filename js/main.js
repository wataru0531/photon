import "../sass/style.scss";

/**************************************************************

  Pexels https://www.pexels.com/api/documentation/
  document https://www.pexels.com/api/documentation/#photos-curated

  API key:  IjABpDeNJxW78UJ5ELFBQvzQLLATuCvG6reLDzTSaELPMhgQd3dJ26Gp
***************************************************************/

// PexelsのApi key
const auth = "IjABpDeNJxW78UJ5ELFBQvzQLLATuCvG6reLDzTSaELPMhgQd3dJ26Gp";

const gallery = document.getElementById("js-gallery");
const searchInput = document.getElementById("js-searchInput");
const form = document.getElementById("js-form");
const moreBtn = document.getElementById("js-moreBtn");

let searchValue;

let page = 1;
let fetchLink;
let currentSearch;


// Event Listener
 // inputの値を取得
searchInput.addEventListener("input", updateInput);

 // フォームクリック
form.addEventListener("submit", (e) => {
  e.preventDefault(); // レンダリングを防ぐ

  currentSearch = searchValue; // 現在検索している文字列

  // console.log(searchValue); // {page: 1, per_page: 15, photos: Array(15), total_results: 8000, next_page: 'https://api.pexels.com/v1/search/?page=2&per_page=15&query=dogs'}
  searchPhotos(searchValue)
});

// moreボタンクリック
moreBtn.addEventListener("click", loadMore)


// Functions

// moreボタンクリック → 画像ロードする処理
async function loadMore() {
  try {
    page++; // ページを1プラス

    if(currentSearch){
       // 15枚の画像を1ページとして取得
      fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
    } else {
      fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    }

    const data = await fetchApi(fetchLink); // 画像取得

    generatePictures(data); // 画像挿入

  } catch (error) {
    console.error("Don't Fetch Images!!", error);
  }
}


// inputの値を取得
function updateInput(e) {
  // console.log(e); // InputEvent {isTrusted: true, data: 'd', isComposing: false, inputType: 'insertText', dataTransfer: null, …}
  // console.log(e.target.value);

  searchValue = e.target.value;
}

// inputの値をクリア
function clearInput(e){
  searchInput.value = ""
}

function clearImg(){
  gallery.innerHTML = "";
}

// ギャラリーから画像を削除
function clear(){
  clearImg();   // 画像を全て削除
  clearInput(); // inputの値クリア
}


// 画像取得のapiを叩く処理
async function fetchApi(url){
  const dataFetch = await fetch(
    url,
    {
      method: "GET",
      headers: {
        // クライアントが受け入れるレスポンスの形式を指定。
        Accept: "application/json",
        Authorization: auth,
      },
    }
  )

  const data = await dataFetch.json();
  // console.log(data) // {page: 1, per_page: 15, photos: Array(15), total_results: 8000, next_page: 'https://api.pexels.com/v1/curated/?page=2&per_page=15'}
  
  return data;
}

// 画像を挿入する処理
function generatePictures(_data){
  clearInput() // inputの値削除

  _data.photos.forEach(photo => {
    // console.log(photo)

    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");

    galleryImg.innerHTML = `
      <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
      </div>
      <img src=${photo.src.large} alt=${photo.photographer}/>
    `;

    gallery.appendChild(galleryImg);
  })
}


// fetchメソッド
// GETリクエストを送信する場合、一般的にはContent-Typeヘッダーは不要。
// Content-Typeヘッダーはリクエストのボディに含まれるデータの形式を示すために使用されるが、
// GETリクエストではボディが存在しないため、通常は指定しない。

// 画像を取得する関数    curate 収集・整理す
async function curatedPhotos() {
  try {
    fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";

    const data = await fetchApi(fetchLink); // 画像取得
    generatePictures(data);  // 画像を挿入

  } catch (error) {
    console.error("Don't Fetch Images!!", error);
  }
}

// curatedPhotos();

// 画像を検索して挿入する関数
async function searchPhotos(query) { // inputから値を取得
  try {
    fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;

    // 画像取得
    const data = await fetchApi(fetchLink)

    generatePictures(data); // 画像を挿入

  } catch (error) {
    console.error("Don't search photos!!", error);
  }
}
