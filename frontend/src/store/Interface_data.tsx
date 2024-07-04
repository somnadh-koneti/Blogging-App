export interface Author {
    name: string;
    userImage: string | null;
}

export interface Post {
    id: string;
    savedBy: boolean;
    authorId: string;
    title: string;
    content: string;
    image: string | null;
    createdAt: string; 
    tags: string[];
    author: Author;
}

export interface Following {
    id: string;
    name: string;
    userImage: string | null;
    isFollowingMe: boolean;
    following: { followedById: string }[];
}

export interface FollowedBy {
    following:
    {
        id: string;
        name: string;
        userImage: string | null;
    };
}

export interface Data {
    id: string;
    name: string;
    email: string;
    userImage: string | null;
    createdAt: string;
    followedBy: FollowedBy[];
    following: Following[];
    posts: Post[];
}

export interface home_data_val{
    id: string;
    name: string;
    userImage: string | null;
}


//----------------profile_frd_card.tsx------------------

export interface profile_frd_card_data{
    name:string,
    image:string| null,
    id:string,
    frd:boolean
}

//------------------profile_edit.tsx----------------------

export interface profile_edit{
    name:string,
    CurrPass:string,
    NewPass:string,
    RetyPass:string,
    image:{base64:string| null,name:string|null}
}

