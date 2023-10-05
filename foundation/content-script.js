console.log("hey queen! content script working if you see this!");

let paragraphs = document.getElementsByTagName('p');
for (elt of paragraphs) {
    elt.style['background-color'] = '#FF00FF';

}