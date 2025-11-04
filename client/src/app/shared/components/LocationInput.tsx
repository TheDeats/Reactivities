import { useEffect, useMemo, useState } from "react";
import { type FieldValues, useController, type UseControllerProps } from "react-hook-form"
import { Box, debounce, List, ListItemButton, TextField, Typography } from "@mui/material";
import axios from "axios";

type Props<T extends FieldValues> = {
    label: string
} & UseControllerProps<T>

export default function LocationInput<T extends FieldValues>(props: Props<T>) {
    const {field, fieldState} = useController({...props});
    const [loading, setLoading] = useState(false);
    const [suggestiongs, setSuggestions] = useState<LocationIQSuggestion[]> ([]);
    const [inputValue, setInputValue] = useState(field.value || '');

    const locationUrl = 'https://api.locationiq.com/v1/autocomplete?key=pk.7fb26b1905df3d883c55065bec529139&limit=5&dedupe=1&';

    useEffect(() => {
        if (field.value && typeof field.value === 'object'){
            setInputValue(field.value.venue || '');
        } else {
            setInputValue(field.value || '');
        }
    }, [field.value])

    const fetchSuggestions = useMemo(
        () => debounce(async (query: string) => {
            if (!query || query.length < 3){
                setSuggestions([]);
                return;
            }
            setLoading(true);
            try {
                const res = await axios.get<LocationIQSuggestion[]>(`${locationUrl}q=${query}`)
                setSuggestions(res.data);
            } catch (error) {
                console.log(error);
            } finally{
                setLoading(false);
            }
        }, 500), [locationUrl]
    );

    const handleChange = async (value: string) => {
        field.onChange(value);
        await fetchSuggestions(value);
    }

    const handleSelect = (location: LocationIQSuggestion) => {
        const city = location.address?.city || location.address?.town || location.address?.village;
        const venue = location.display_name;
        const latitude = location.lat;
        const longitude = location.lon;
        setInputValue(venue);
        field.onChange({city, venue, latitude, longitude});
        setSuggestions([]);
    }
    
  return (
    <Box>
        <TextField
            {...props}
            value={inputValue}
            onChange={e => handleChange(e.target.value)}
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
        {loading && <Typography>Loading...</Typography>}
        {suggestiongs.length > 0 && (
            <List sx={{border: 1}}>
                {suggestiongs.map(suggestion => (
                    <ListItemButton
                        divider
                        key={suggestion.place_id}
                        onClick={() => handleSelect(suggestion)}>
                        {suggestion.display_name}
                    </ListItemButton>
                ))}

            </List>
        )}
    </Box>
  )
}