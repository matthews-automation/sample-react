# Matthews Website
Development Environent for Matthews wordpress theme and NextJS front end.

### Dependencies

* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [NodeJS >= 20](https://nodejs.org/en)

### Installing
* From the web directory run `npm i` to install FE packages.
* From the web directory run `npm run start:wp` to run the local wordpress instance, seed data from the [wp_matthews.sql](../wp/db/wp_matthews.sql) file should start your database fully setup with a default admin login of admin \ password (this database should not be deployed and only used locally).

### Executing program
Ensure the local wordpress instance is running:   
*  run `npm run dev` to start the FE on port 3000

### Development
Pages can be defined in the pages directory for sandbox development. All real site pages must be defined in wordpress (local or hosted) in order to be resolved and not throw a 404.   
Components / Options / Post Types / Etc. are defined in ACF and when they are saved in WP they are saved to the theme in the `acf-json` folder. This ensures everyone has the same definitions for fields. These do have to be syncronized in the WP admin panel go to ACF / [FIELD_TYPE] and see `sync-available` to synchronize fields to the latest acf-json. 

### Deploying
The frontend and wordpress are deployed separately.  
* **FE deploy:** `npm run deploy` this will build and copy files to the VM that runs the FE.    
* **Wordpress deploy:** `npm run deploy:wp` this will copy only the custom Matthews theme files from your local to the VM that runs wordpress.   
* **Plugins deploy:** Plugins are tracked in git in order to ensure everyone has the same plugins for local development but not deployed by default with the custom theme files.   
`npm run deploy:plugins` copy all plugin files from the wordpress plugins folder to the VM that runs wordpress.   
New plugins will need to be activated and setup on the VM.    

## Help
The appropriate plugin keys should come with the seed data from the sql file but if any plugins are inactive or missing keys find and enter them in your local wp instance.

## Spline usage
We are currently using Spline exports for the header sections. There are a couple of notable tradeoffs with this.
- Using Spline makes it easy to handle feedback and updates and reduces code.
- It also makes it a little difficult to get exact control things like scroll and mouse movement, because those things are handled in Spline.
- This also means scroll responsiveness (viewport height, specifically) is difficult to nail down.

Some potential solves that I [neil] haven't been able to fully explore yet:
- Try to re-implement the rotation/position/scale behavior in GSAP. Applying the same values from Spline didn't have the same effect for me. But I ran out of time.
- Try to create some variable proxy in Spline that can replace the `Scroll` handler. E.g., if you can get a Spline variable to control the animation from 0-100%, you might be able to set that variable in javascript. (See "Updating scene variables" in [this link](https://www.npmjs.com/package/@splinetool/runtime))
- If Wes has availability, he might be able to recreate the animation in Blender with rigged models. In which case, using the threejs animation system should be easier. This would also remove the dependency on Spline.
- Another thing that might be doable is combine the scroll handler with a `Variable Change` event in Spline. So initial scroll will do _some_ motion (via `Scroll` handler), and once you hit a certain scroll trigger, a `Variable Change` handler could finish the transition. And then use the same scroll trigger/variable change handler to reset to the Base state when scrolling back up.
