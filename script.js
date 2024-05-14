$(document).ready(() => {
    
    //-----------------------------------------------------------------------------Functions
    const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersColorScheme) {
        $('html').addClass('dark')
    } else {
        $('html').addClass('light')
    }

  

    const defaultMode = () => {
        if ($('html').hasClass('dark')) {
            $('.switch_main').addClass('orange');
            $('.switch_inner').addClass('switched');
        } else {
            $('.switch_main').removeClass('orange');
            $('.switch_inner').removeClass('switched');
        }
    }

    defaultMode();




    const markdownParser = () => {
        
        const text = document.getElementById('txt-editor').value;
        // Perform the conversion
        const editor = document.querySelector('.text_preview');
        const converter = new showdown.Converter();
        let convertedText = converter.makeHtml(text);
        editor.innerHTML = convertedText;
    }

   
    
    const areaToggle = () => {
        $('.markdown').slideToggle();
        $('.preview').slideToggle();
    }

    const smallScreenSetup = () => {
        $('.show-preview').hide();
        $('.hide-preview').show();
        $('.markdown').show();
        $('.preview').hide();
    }

    const wideScreenSetup = () => {
        $('.hide-preview').hide();
        $('.show-preview').show();
        $('.preview').show();
        $('.markdown').show();
    }

  

    const formatDate = (date) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    
    const renderSavedDocuments = () => {
       
        const keys = Object.keys(localStorage);
        
        
        const container = $('.data-wrapper');        
        container.empty();
        const prefix = 'mark_';

       
        keys.forEach(key => {
            
            if (key.startsWith(prefix)) {
                // Parse the JSON data from localStorage
                const data = JSON.parse(localStorage.getItem(key));

                
                const formattedDate = formatDate(data.created);

                
                const documentDiv = $('<div>').addClass('documents_document');

                
                const imgElement = $('<img>').attr('src', 'assets/icon-document.svg').attr('alt', '');

                
                const dateElement = $('<span>').addClass('data_date').text(formattedDate);
                const nameElement = $('<span>').addClass('data_name').text(key.substring(prefix.length)); 

                
                const dataWrapper = $('<div>').addClass('documents_document--data').append(dateElement, nameElement);
                const imgWrapper = $('<div>').addClass('documents_document--img').append(imgElement);
                documentDiv.append(imgWrapper, dataWrapper);

                
                container.append(documentDiv);
            }
        });
    };

    const loadDocument = (key) => {
        
        const data = JSON.parse(localStorage.getItem(key));
        
        
        if (data) {
            
            $('#document_name').val(key.slice('mark_'.length));

            
            if (data.content) {
                
                $('#txt-editor').val(data.content);
            } else {
                console.error('Data does not contain content property:', data);
            }
        } else {
            console.error('Data not found for key:', key);
        }
    };

    const saveChanges = () => {
        const text = $('#txt-editor').val();
        const documentName = $('#document_name').val();
    
        
        const key = 'mark_' + documentName;
    
        
        if (localStorage.getItem(key)) {
            
            const currentDate = new Date();
    
            
            const formattedDate = currentDate.getDate().toString().padStart(2, '0') + ' ' +
                                 new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate) + ' ' +
                                 currentDate.getFullYear();
    
            const data = {
                content: text,
                created: formattedDate
            };
    
            
            localStorage.setItem(key, JSON.stringify(data));
        } else {
            
            const data = {
                content: text,
                created: new Date().toISOString()
            };
    
            
            localStorage.setItem(key, JSON.stringify(data));
        }

        
        renderSavedDocuments();
    };

    const deleteDoc = (key) => {
        localStorage.removeItem(key);
        renderSavedDocuments();
        $('#document_name').val('');
        $('#txt-editor').val('');
        $('#document_name').focus();
    }

    //------------------------------------------data fetching for starting value of the textarea
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('txt-editor').value = data[1].content;
        markdownParser();
    })

    //-----------------------------------------EventListeners
    
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
        $('.documents').toggle();
        $('.open').toggle();
        $('.close').toggle();
    })

    $('.hide-markd').on('click', () => {
        areaToggle();
    })


    window.addEventListener('resize', () => {
        if(window.innerWidth < 768){
            smallScreenSetup();
        } else {
            wideScreenSetup();
        }
    })

    $('.hide-preview').on('click', (e) => {
        if(window.innerWidth < 768){
            areaToggle();
        } else {
            $('.markdown').toggle();
            $(e.currentTarget).toggle();
            $('.show-preview').toggle();          
        }
    })

    $('.show-preview').on('click', (e) => {
        $('.markdown').toggle();
        $(e.currentTarget).toggle();
        $('.hide-preview').toggle();
    })

    $('.new-doc').on('click', (e) => {
        e.preventDefault();
        $('#txt-editor').val('');
        $('#document_name').val('.md');
        $('#document_name').focus();

        const input = document.getElementById('document_name');
        input.setSelectionRange(0, 0);

        $('.documents').toggle();
        $('.open').toggle();
        $('.close').toggle();
    })

    $('.save').on('click', (e) => {
        e.preventDefault();
        saveChanges();
    })

    $('.data-wrapper').on('click', '.documents_document', function() {
        // Get the key associated with the clicked document
        const dataName = $(this).find('.data_name').text(); 
        const key = 'mark_' + dataName; // Add the prefix
        
        
        loadDocument(key);
        markdownParser();
    });

    $('.delete').on('click', () => {
        const key = 'mark_' + $('#document_name').val();
        deleteDoc(key);
    })

    $('.switch_main').on('click', (e) => {
        $(e.currentTarget).toggleClass('orange');
        $('.switch_inner').toggleClass('switched');
        $('html').toggleClass('dark');
        $('html').toggleClass('light');
    });

    $('#txt-editor').on('click', () => {
        $('.documents').hide();
        $('.open').show();
        $('.close').hide();
    })

    //-----------------------------------------Function callbacks

    renderSavedDocuments();

    
});




// small screen: hide_markd, hide_preview



//wide screen: hide_preview, show_preview