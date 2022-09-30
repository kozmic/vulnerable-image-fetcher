
const imageUrl = new URLSearchParams(window.location.search).get('imageUrl')
if(imageUrl) {
    document.querySelector('body > form > input.imageUrl').value = imageUrl
    document.querySelector('img').src = `/fetchImage?imageUrl=${imageUrl}`
}