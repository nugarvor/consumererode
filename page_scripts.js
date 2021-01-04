        var doc, rendered_page_num;
        
        async function getPdf()
        {

            
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.5.207/build/pdf.worker.js';
            if (doc) doc.destroy();
            
            selection = document.getElementById("select_file");
            if (selection.options.length == 0)
            {
                selection.options[0] = new Option("NKJan21.pdf","https://consumererode.org/NKJan21.pdf");
                selection.selectedIndex = 0;
            }
            const URL = selection.options[selection.selectedIndex].value;
            

            fetch(URL, {method:'GET', mode:'no-cors'}).then(d=> {console.log(d);}, d=> {console.log(d);})
            let d1;
            dataLoaded = fetch(URL, {method:'GET'}).then(d=> d.arrayBuffer()).then(function(data) {d1=data;
                return data;  });
            
            //FIXME: Use async better
            await dataLoaded;
            console.log(dataLoaded);
            
            
            syncpoint = pdfjsLib.getDocument({data:d1}).promise.then( function(pdf) {
            
                doc=pdf; 
                });
            await syncpoint;
        }
        function selectionChange(e)
        {
            console.log("selection changed")
            selection = document.getElementById("select_file");
            if (URL == selection.options[selection.selectedIndex].value) return;
            
            pdf_render_init();
        }
        async function pdf_render_init()
        {
            render_complete = true;
            wait_getPdf = getPdf();
            await wait_getPdf;
            
            document.getElementById("first_page").onclick = first_page_clicked;
            document.getElementById("prev_page").onclick = prev_page_clicked;
            document.getElementById("next_page").onclick = next_page_clicked;
            document.getElementById("last_page").onclick = last_page_clicked;
            document.getElementById("pdf_canvas").addEventListener('touchstart', handleTouchStart, false);        
            document.getElementById("pdf_canvas").addEventListener('touchmove', handleTouchMove, false);
            document.getElementById("pdf_canvas").addEventListener('mousedown', handleTouchStart, false);        
            document.getElementById("pdf_canvas").addEventListener('mouseup', handleTouchMove, false);
            document.getElementById("select_file").addEventListener('change', selectionChange, false);
            
            render_page(1);
            
            
        }
        
        function render_page(page_num)
        {
                if (!render_complete) 
                {
                    console.log("Ignoring click. Previous render in progress. ")
                    return;    
                }                    
                render_complete = false;
                rendered_page_num = page_num;
                var pdf_canvas = document.getElementById("pdf_canvas");
                var context = pdf_canvas.getContext("2d");
                if (window.mobile_check == true)
                {
                    scale=0.65;
                } else scale=1;
                doc.getPage(page_num).then(page => {
                viewport = page.getViewport({scale:scale});
                console.log("viewport width ", viewport.width, "viewport height ", viewport.height)
                pdf_canvas.width = viewport.width;
                pdf_canvas.height = viewport.height;
                if (context) {
                    context.clearRect(0, 0, pdf_canvas.width, pdf_canvas.height);
                    context.beginPath();
                }
                document.getElementById("Loading").style.visibility="visible";
                page.render({
                    canvasContext:context,
                    viewport: viewport
                }).promise.then(function() { render_complete = true; document.getElementById("Loading").style.visibility="hidden";});
                
                
            
                console.log("num pages = " + doc._pdfInfo.numPages)
                page_Element = document.getElementById("page_num")
                page_Element.value = page_num;
                total_Element = document.getElementById("total_page")
                total_Element.innerHTML = "of total:" + doc._pdfInfo.numPages;
                
                
            });

        }
        
        function first_page_clicked()
        {
            render_page(1);
        }
        
        function prev_page_clicked()
        {
            if (rendered_page_num > 1 ) render_page(rendered_page_num - 1);
        }
        
        function next_page_clicked()
        {
            if (rendered_page_num < doc._pdfInfo.numPages) render_page(rendered_page_num + 1);
        }
          
        function last_page_clicked()
        {
            render_page(doc._pdfInfo.numPages);
        }
        
        
        function getTouches(evt) {
          if (evt.type == "mousedown" || evt.type=="mouseup")
          {
              evt.touches = [evt];
              
          }
          return evt.touches ||             // browser API
          evt.originalEvent.touches; // jQuery
        }                                                     

        function handleTouchStart(evt) {
            console.log("touchstart called")
            const firstTouch = getTouches(evt)[0];                                      
            xDown = firstTouch.clientX;                                      
            yDown = firstTouch.clientY;                                      
        };                                                

        function handleTouchMove(evt) {
            console.log("touchmove called")
        if ( ! xDown || ! yDown ) {
            return;
        }
        
        const secondTouch = getTouches(evt)[0];
        var xUp = secondTouch.clientX;                                    
        var yUp = secondTouch.clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                next_page_clicked(); 
            } else {
                prev_page_clicked();
            }                       
        } else {
            if ( yDiff > 0 ) {
                //last_page_clicked();
            } else { 
                //first_page_clicked();
            }                                                                 
        }
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };
