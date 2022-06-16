<template>
    <div  class="bg-splash">
        <div class="splash-container">
            <!--div class="audible">
              <img src="/assets/background/logo_color.png" alt="">
               <div>Engineering Associates</div>
            </div>
          
           <div class="and">
                &
            </div-->
            <div class="img-museum">
                <img src="/assets/background/logo.png" alt="">
            </div>

        </div>

        
    </div>
</template>

<script>
    export default {
        name: "loader"
    }
</script>

<style >
    .bg-splash{
        /*background-color: #3693C8;
        color: #fcd24d;*/
        background-color: #f5f5f5;
        color: #095aa8;;
        position:absolute; 
        width: 100%; 
        height:100%; 
        top:0; 
        left:0; 
        z-index:10000;
    }
    .splash-container{
        height: 100%;
        width: 100%;
        padding: 5vh;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .audible{
        font-size: 19px;
        
        font-weight: 600;
        margin-bottom: 38px;
    }
    .audible>img{
        width: 150px;
        margin-bottom: 1vh;
    }
    .and{
        font-size: 23px;

    }
    .img-museum{
        width: 144px;
        margin: 0 auto;
        margin-top: 37px;
    }

</style>
