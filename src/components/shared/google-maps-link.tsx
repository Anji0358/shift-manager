import { ExternalLink, MapPin } from "lucide-react";
import { buildGoogleMapsSearchUrl } from "@/lib/google-maps";
import { Button } from "@/components/ui/button";

type GoogleMapsLinkProps = {
    query: string;
    label?: string;
};

export const GoogleMapsLink = ({
    query,
    label = "Google Mapsで開く",
}: GoogleMapsLinkProps) => {
    if (!query) {
        return null;
    }

    return (
        <Button
            asChild
            size="sm"
            variant="outline"
            className="transition hover:bg-slate-100 active:scale-95"
        >
            <a
                href={buildGoogleMapsSearchUrl(query)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
            >
                <MapPin className="h-4 w-4" />
                {label}
                <ExternalLink className="h-3 w-3" />
            </a>
        </Button>
    );
};