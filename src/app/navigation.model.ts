export class NavigationModel
{
    public model: any[];

    constructor()
    {
        this.model = [
            {
                'id'      : 'applications',
                'title'   : 'Applications',
                'type'    : 'group',
                'children': [
                    {
                        'id'   : 'users',
                        'title': 'Users',
                        'type' : 'item',
                        'icon' : 'account_box',
                        'url'  : '/users',
                    },
                    {
                        'id'   : 'categories',
                        'title': 'Categories',
                        'type' : 'item',
                        'icon' : 'group_work',
                        'url'  : '/categories',
                    },
                    {
                        'id'   : 'countries',
                        'title': 'Countries',
                        'type' : 'item',
                        'icon' : 'flag',
                        'url'  : '/countries',
                    },
                    {
                        'id'   : 'advertisements',
                        'title': 'Advertisements',
                        'type' : 'item',
                        'icon' : 'web',
                        'url'  : '/advertisements',
                    },
                    {
                        'id'   : 'sample',
                        'title': 'Sample',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample',
                        'badge': {
                            'title': 25,
                            'bg'   : '#F44336',
                            'fg'   : '#FFFFFF'
                        }
                    }
                ]
            }
        ];
    }
}
