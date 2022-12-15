'use strict';
exports.main = async (event, context) => {
	return {
		templates: [
			{
				image_url: "https://mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.cdn.bspapp.com/cloudstorage/bfaef5df-9470-4e7a-8feb-c651f0e5078c.png",
				title: '圣诞头像',
				page: "/pages/templates/christmas"
			},
			{
				image_url: "https://mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.cdn.bspapp.com/cloudstorage/bfaef5df-9470-4e7a-8feb-c651f0e5078c.png",
				title: '萌宠大变身',
				page: "/pages/templates/pet_humanoid"
			},
			
		],

		uploader_init_image: {
			pet_humanoid: 'https://mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.cdn.bspapp.com/cloudstorage/bea3e18e-04e6-4d99-9abc-6f15168f617b.jpg',
			christmas: 'https://mp-ebf46e6b-2e61-4306-8125-6e286aa5ab21.cdn.bspapp.com/cloudstorage/bea3e18e-04e6-4d99-9abc-6f15168f617b.jpg',
		}
	};
};
