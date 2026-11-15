export interface SocialProfile {
	label: string
	url: string
}

export const socialProfiles: SocialProfile[] = [
	{ label: 'GitHub', url: 'https://github.com/kbmjj123' },
	{ label: 'X', url: 'https://x.com/solomaker282' },
	{ label: 'Stack Overflow', url: 'https://stackoverflow.com/users/20466521/genglin-zheng' },
	{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/genglin-zheng-a34014230/' },
	{ label: 'Facebook', url: 'https://www.facebook.com/keby.zheng' },
	{ label: 'Instagram', url: 'https://www.instagram.com/kebyzheng/' },
]

export const siteSocialLinks = {
	rss: '/feed.xml',
	email: 'mailto:hello@kbmjj123.cc',
	mastodon: 'https://mastodon.social/@kbmjj123',
	youtube: 'https://www.youtube.com/@kbmjj123',
}
