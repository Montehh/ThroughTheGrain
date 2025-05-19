const { folderId, apiKey } = window.GalleryConfig || {};
if (!folderId || !apiKey) {
  console.error('Missing folderId or apiKey in GalleryConfig.');
}

function fetchImages() {
const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,description,createdTime,starred)`;

fetch(url)
    .then(response => response.json())
    .then(data => {
    const files = data.files;

    if (files && files.length > 0) {
        let images = files
        .filter(file => file.mimeType.startsWith('image/'))
        .map(file => ({
            url: `https://lh3.googleusercontent.com/d/${file.id}`,
            name: file.name,
            description: file.description?.trim() || '',
            starred: file.starred || false,
            createdTime: new Date(file.createdTime)
        }))
        .sort((a, b) => {
            const numA = parseInt(a.description);
            const numB = parseInt(b.description);
            const isNumA = !isNaN(numA);
            const isNumB = !isNaN(numB);

            if (isNumA && isNumB) {
                return numA - numB;
            } else if (isNumA) {
                return -1;
            } else if (isNumB) {
                return 1;
            } else {
                return b.createdTime - a.createdTime;
            }
        });

        loadImagesAndRender(images);
    } else {
        console.log('No images found.');
    }
    })
    .catch(error => console.error('Error fetching images:', error));
}

function loadImagesAndRender(images) {
const promises = images.map(image => {
    return new Promise(resolve => {
    const img = new Image();
    img.src = image.url;
    img.onload = () => {
        image.orientation = img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait';
        resolve(image);
    };
    img.onerror = () => resolve(image);
    });
});

Promise.all(promises).then(imagesWithOrientation => {
const galleryDiv = document.getElementById('gallery');
galleryDiv.innerHTML = buildLayoutHTML(imagesWithOrientation);
  Fancybox.bind("[data-fancybox]", {});
  if (window.runFadeIn) runFadeIn();
});
}

function buildLayoutHTML(images) {
let html = '';
let portraitQueue = [];

for (let i = 0; i < images.length; i++) {
    const img = images[i];

    if (img.orientation === 'landscape') {
    if (portraitQueue.length >= 2) {
        html += renderImage(portraitQueue.shift(), 'col-span-1');
        html += renderImage(portraitQueue.shift(), 'col-span-1');
    }

    html += renderImage(img, 'col-span-2');
    } else {
    portraitQueue.push(img);

    if (portraitQueue.length === 2) {
        html += renderImage(portraitQueue.shift(), 'col-span-1');
        html += renderImage(portraitQueue.shift(), 'col-span-1');
    }
    }
}

if (portraitQueue.length === 1) {
    html += renderImage(portraitQueue[0], 'col-span-2');
}

return html;
}

function renderImage(image, colSpanClass) {
return `
    <div class="${colSpanClass}">
    <a href="${image.url}" data-fancybox="gallery" data-caption="${image.description}">
        <img src="${image.url}" alt="${image.description}" class="w-full h-full object-cover object-center fade-target" />
    </a>
    </div>
`;
}

window.onload = fetchImages;