         
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            window.mobile_check = true;
        }
        else{
            window.mobile_check = false;
        }
        $(document).ready(function(){
            var big_padding = "13px";
            var big_font_size = "20";
            var big_height = "55px";
            var big_body_font_size;
            var big_footer_font_size;
            
            var small_padding = "3px";
            var small_font_size = "8";
            var small_height = "18px";
            if (window.mobile_check)
            {
                big_padding = "23px";
                big_font_size = "40";
                big_body_font_size = "40";
                big_footer_font_size = "37";
                big_height = "150px";
            
                small_padding = "3px";
                small_font_size = "8";
                small_height = "18px";
                $("p").css("font-size", big_body_font_size);
                $("p").css("line-height", "110%");
                $(".footer_text").css("font-size", big_footer_font_size);
                $("#logo").width("200px");
                $("#logo").height("200px");
            }
            $(".accordion_header").css("padding", big_padding);
            $(".accordion_header").css("font-size", big_font_size); 
            $(".accordion_header").css("height", big_height); 
			$(".accordion_header").click(function(){
               var removeThis = false;
			   if ($(this).hasClass("active"))
			       removeThis=true; 
               $(".accordion_header").removeClass("active");

               if (removeThis) {
                   $(".accordion_header").css("padding", big_padding);
                   $(".accordion_header").css("font-size", big_font_size); 
                   $(".accordion_header").css("height", big_height); 
                   $(".footer_img").css("opacity", "1");
                   $(".footer_text").css("opacity", "1");
                   $(this).removeClass("active");
                   console.log("big_padding=", big_padding);
                   }
               else 
               {
                   $(".accordion_header").css("padding", small_padding);
                   $(".accordion_header").css("font-size", small_font_size); 
                   $(".accordion_header").css("height",small_height);
                   $(this).addClass("active");
                   $(this).css("padding", big_padding);
                   $(this).css("font-size", big_font_size); 
                   $(this).css("height",big_height);
                   $(".footer_img").css("opacity", "0.1");
                   $(".footer_text").css("opacity", "0.1");
               }
			});
		}
        );