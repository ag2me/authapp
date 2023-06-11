$li = $('.mu-simplefilter').find('li')
console.log($li.eq(0).attr('data-filter'))
$('li').click(function(){
    for(var i = 0; i < $li.length ;i++){
        $($li.eq(i)).removeClass('active')
    }
    $(this).addClass('active')
    $category = $('.filtr-container').find('.category')
    for(var i = 0; i < $category.length ; i++){
        $($category.eq(i)).closest('.filtr-item').css('display','block')
        if($(this).text() == 'All'){
            $($category.eq(i)).closest('.filtr-item').css('display','block')
        }
        else if($category.eq(i).text() != $(this).text()){
            $($category.eq(i)).closest('.filtr-item').css('display', 'none')
        }
    }
}) 
