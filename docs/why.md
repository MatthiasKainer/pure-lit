# Rational

The main idea behind pureLit is to reduce the amount of code one has to write. Compare the code you need for a standard Lit-Element with one where pure-lit was used to see the amount of code you can remove:
    
<style>
    .container {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .container>pre {
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 5px !important;
      margin-right: 5px !important;
    }
</style>
<div class="container">

[gist: before.ts](https://gist.githubusercontent.com/MatthiasKainer/ef075d9c0200964351b1c0a4392b9772/raw/2d4a52259201d2c5c9db68bd8a8e418b7cdbe766/before.ts ':include :type=code')

[gist: after.ts](https://gist.githubusercontent.com/MatthiasKainer/410795b0c437936124002afde32cdd52/raw/702e5e11b7a53942c5ed33a9a3954c53cb6d64f1/after.ts ':include :type=code')

</div>

A longer description on the why can be found in the article [Write Less Code For Smaller Packages With `pure-lit`](https://matthias-kainer.de/blog/posts/write-less-code-with-pure-lit/)