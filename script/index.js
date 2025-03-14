const searchEl = document.getElementById('search')
function loadCategories() {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
}
function loadVideos(textInput = "") {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${textInput}`)
    .then((res) => res.json())
    .then((data) => {
      const allBtn = document.getElementById('btn-all')
      removeActiveClass()
      allBtn.classList.add('active')
      showVideos(data.videos)
    });
}
const loadCategoryVideos = (id) => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showVideos(data.category)
      const catBtn = document.getElementById(`btn-${id}`)
      removeActiveClass()
      catBtn.classList.add('active')
    });
};
function removeActiveClass(){
  const activeBtns = document.getElementsByClassName('active')
  for(let btn of activeBtns){
    btn.classList.remove('active')
  }
}
function displayCategories(categories) {
  // get the html element
  const ctgContainer = document.getElementById("ctg-container");
  // loop through the array
  for (let cat of categories) {
    // create div to store the data
    const ctgEl = document.createElement("div");
    // show data
    ctgEl.innerHTML = `
        <button 
        id="btn-${cat.category_id}"
        onclick = "loadCategoryVideos(${cat.category_id})"
        class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>
        `;
    ctgContainer.appendChild(ctgEl);
  }
}
const loadDetails = videoId => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  fetch(url)
    .then(res => res.json())
    .then(data => shadowDetails(data.video))
}
const shadowDetails=(video)=>{
  document.getElementById('show_details').showModal()
  const detailContainer = document.getElementById('show_details')
  detailContainer.innerHTML = `
    <div class="card bg-base-100 image-full w-96 shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${video.title}</h2>
    <p>${video.description}</p>
    <div class="card-actions justify-end">
            <form method="dialog">
        <button class="btn btn-primary">Close</button>
      </form>
    </div>
  </div>
</div>
  `
}
const showVideos = (videos) => {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = "";
  if (videos.length === 0) {
    videoContainer.innerHTML = `<div class="col-span-full flex flex-col justify-center items-center my-20">
                <img class="w-[160px]" src="./images/Icon.png" alt="icon">
                <h2 class="text-4xl">Oops!! Sorry, There is no content here</h2>
            </div>`;
  }
  videos.forEach((video) => {
    const videoCard = document.createElement("div");
    videoCard.innerHTML = `
        <div class="card bg-base-100 shadow-sm h-full">
  <figure>
    <img
      class="w-full h-[150px] object-cover"
      src="${video.thumbnail}"
      alt="video" />
  </figure>
  <div class="flex gap-3 my-3">
    <div class="avatar">
        <div class="w-6 h-6 rounded-full">
          <img src="${video.authors[0].profile_picture}" />
        </div>
    </div>


    <div class="">
    <h2 class="font-bold text-xl">${video.title}</h2>
    <div class= "flex gap-1">
    <p class="text-sm">
    ${video.authors[0].profile_name}
    ${video.authors[0].verified === true ? '<p><img width="18" height="18" src="https://img.icons8.com/color/96/verified-badge.png" alt="verified-badge"/></p>': ''}
    </p>
    </div>
    <p class="text-sm">${video.others.views} views</p>
    </div>
</div>
    <div class="mt-auto">
    <button 
    onclick="loadDetails('${video.video_id}')" class="btn btn-wide">Details</button>
    </div>
        `;
    videoContainer.appendChild(videoCard);
  });
};

searchEl.addEventListener('keyup', e => {
  const textInput = e.target.value
  loadVideos(textInput)
})
loadCategories();
