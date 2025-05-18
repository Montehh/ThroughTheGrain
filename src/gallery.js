const { folderId, apiKey } = window.GalleryConfig || {};
if (!folderId || !apiKey) {
  console.error('Missing folderId or apiKey in GalleryConfig.');
}

function createImageGroup(images) {
  return `
    <div class="flex w-full md:w-1/2 flex-wrap">
      ${images[0] ? `<div class="w-full md:w-1/2 p-1"><div class="overflow-hidden h-full w-full">
        <a href="${images[0]}" data-fancybox="gallery">
          <img alt="" class="block h-full w-full object-cover object-center opacity-0 animate-fade-in transition duration-500 transform scale-100 hover:scale-110" src="${images[0]}" />
        </a></div></div>` : ''}
      ${images[1] ? `<div class="w-full md:w-1/2 p-1"><div class="overflow-hidden h-full w-full">
        <a href="${images[1]}" data-fancybox="gallery">
          <img alt="" class="block h-full w-full object-cover object-center opacity-0 animate-fade-in transition duration-500 transform scale-100 hover:scale-110" src="${images[1]}" />
        </a></div></div>` : ''}
      ${images[2] ? `<div class="w-full p-1"><div class="overflow-hidden h-full w-full">
        <a href="${images[2]}" data-fancybox="gallery">
          <img alt="" class="block h-full w-full object-cover object-center opacity-0 animate-fade-in transition duration-500 transform scale-100 hover:scale-110" src="${images[2]}" />
        </a></div></div>` : ''}
    </div>
    <div class="flex w-full md:w-1/2 flex-wrap">
      ${images[3] ? `<div class="w-full p-1"><div class="overflow-hidden h-full w-full">
        <a href="${images[3]}" data-fancybox="gallery">
          <img alt="" class="block h-full w-full object-cover object-center opacity-0 animate-fade-in transition duration-500 transform scale-100 hover:scale-110" src="${images[3]}" />
        </a></div></div>` : ''}
      ${images[4] ? `<div class="w-full md:w-1/2 p-1"><div class="overflow-hidden h-full w-full">
        <a href="${images[4]}" data-fancybox="gallery">
          <img alt="" class="block h-full w-full object-cover object-center opacity-0 animate-fade-in transition duration-500 transform scale-100 hover:scale-110" src="${images[4]}" />
        </a></div></div>` : ''}
      ${images[5] ? `<div class="w-full md:w-1/2 p-1"><div class="overflow-hidden h-full w-full">
        <a href="${images[5]}" data-fancybox="gallery">
          <img alt="" class="block h-full w-full object-cover object-center opacity-0 animate-fade-in transition duration-500 transform scale-100 hover:scale-110" src="${images[5]}" />
        </a></div></div>` : ''}
    </div>
  `;
}

// Extract leading number from description string (e.g. "12 - Sunset")
function extractNumberFromDescription(description) {
  const match = description && description.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function fetchImages() {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,description,modifiedTime)`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const files = data.files;

      if (files && files.length > 0) {
        const galleryDiv = document.getElementById('gallery');
        galleryDiv.innerHTML = '';

        const sortedImages = files
          .filter(file => file.mimeType.startsWith('image/'))
          .sort((a, b) => {
            const aNum = extractNumberFromDescription(a.description);
            const bNum = extractNumberFromDescription(b.description);

            if (aNum !== null && bNum !== null) {
              return aNum - bNum;
            } else if (aNum !== null) {
              return -1;
            } else if (bNum !== null) {
              return 1;
            } else {
              return new Date(a.modifiedTime) - new Date(b.modifiedTime);
            }
          })
          .map(file => `https://lh3.googleusercontent.com/d/${file.id}`);

        for (let i = 0; i < sortedImages.length; i += 6) {
          const imageBatch = sortedImages.slice(i, i + 6);
          galleryDiv.innerHTML += createImageGroup(imageBatch);
        }
      } else {
        console.log('No images found in this folder.');
      }
    })
    .catch(error => console.error('Error fetching images from Google Drive:', error));
}

window.onload = fetchImages;
Fancybox.bind("[data-fancybox]", {});