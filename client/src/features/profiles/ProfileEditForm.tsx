import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type EditProfileSchema, editProfileSchema } from "../../lib/schemas/editProfileSchema";
import { useProfile } from "../../lib/hooks/useProfile";
import { Box, Button } from "@mui/material";
import TextInput from "../../app/shared/components/TextInput";
import { useParams } from "react-router";
import { useEffect } from "react";

type Props = {
    setEditMode: (editMode: boolean) => void;
}

export default function ProfileEditForm({setEditMode}: Props) {
    const { id } = useParams();
    const { profile, updateProfile } = useProfile(id);
    const { control, handleSubmit, reset, formState: { isValid, isSubmitting }} = useForm<EditProfileSchema>({
            mode: 'onTouched',
            resolver: zodResolver(editProfileSchema)
        });
    
    const onSubmit = async (data: EditProfileSchema) => {
        await updateProfile.mutateAsync(data, {
            onSuccess: () => {
                setEditMode(false);
            }
        });
    }

    useEffect(() => {
        if (profile){
            reset({
                displayName: profile.displayName,
                bio: profile.bio || ''
            })
        }
    }, [profile, reset])

  return (
    <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        display='flex'
        flexDirection='column'
        alignContent='center'
        gap={3}
        mt={3}
    >
        <TextInput label='Display Name' control={control} name='displayName'/>
        <TextInput label='Bio' control={control} name='bio' multiline rows={4}/>
        <Button type='submit' variant="contained" disabled={!isValid || isSubmitting}>Update Profile</Button>
    </Box>
  );
}