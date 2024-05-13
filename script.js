$(document).ready(() => {
    


    const markdownParser = () => {
        
        const text = document.getElementById('txt-editor').value;
        // Perform the conversion
        const editor = document.querySelector('.text_preview');
        const converter = new showdown.Converter();
        let convertedText = converter.makeHtml(text);
        editor.innerHTML = convertedText;
    }

    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('txt-editor').value = data[1].content;
        markdownParser();
    })
    
    const areaToggle = () => {
        $('.markdown').slideToggle();
        $('.preview').slideToggle();
    }


    
    $('#txt-editor').on('input', () => {
        
        markdownParser();
    });

    $('.open').on('click', () => {
        $(".documents").animate({
            width: "toggle"
          }, 'fast');
        $('.open').toggle();
        $('.close').toggle();
    })

    $('.close').on('click', () => {
        $(".documents").animate({
            width: "toggle"
          });
        $('.open').toggle();
        $('.close').toggle();
    })

    

    $('.show-preview').on('click', () => {

    })

   
});




// small screen: hide_markd, hide_preview



//wide screen: hide_markd, show_markd, hide_preview, show_preview