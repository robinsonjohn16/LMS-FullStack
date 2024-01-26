
function CarouselSlide({image,title,des,slideNum,totalslide}){

    return(
        <>
          <div id={`slide${slideNum}`} className="carousel-item relative w-full">
                        <img src={image} className="w-full" />
                        <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                            <a href={`#slide${(slideNum===1)?totalslide:slideNum-1}`} className="btn btn-circle">❮</a> 
                            <a href={`#slide${slideNum%totalslide+1}`} className="btn btn-circle">❯</a>
                        </div>
                        <div className='hidden md:block absolute text-center bottom-1 left-6 w-[80%]'>
                            <p className='text-gray-400'>{des}</p>
                            <h3 className='text-white font-bold'>{title}</h3>
                        </div>
          </div> 
        </>
    )
}

export default CarouselSlide;