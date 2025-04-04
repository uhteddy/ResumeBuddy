export interface Profile {
    id: number;
    name: string;
    email: string;
    phone: string;
    specialty: string;
    description: string;
    address: string;
    github_url: string;
    linkedin_url: string;
    ollama_url: string;
    ollama_model: string;
    created_at: string;
    updated_at: string;
}

export interface Resume {
    id: number;
    title: string;
    content: string;
    profile_id: number;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    url?: string;
    repository_url?: string;
    date_released?: string;
    technologies: string;
    created_at: string;
    updated_at: string;
} 