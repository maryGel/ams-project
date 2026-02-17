import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControlLabel,
    Checkbox,
    Grid,
    // CircularProgress
} from '@mui/material';

const initialFormState = {
    user: '',
    password: '',
    fname: '',
    mname: '',
    lname: '',
    xPosi: '',
    xDept: '',
    Admin: 0,
    Log: 0,
    xlevel: '',
    Approver: 0,
    xSection: '',
    MULTI_DEPT: '',
    MULTI_APP: ''
};

export default function UserFormModal({
    open,
    onClose,
    onSubmit,
    selectedUser,
    isEditing,
    saving,
}) {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedUser && isEditing) {
            setFormData({
                ...selectedUser,
                password: ''
            });
        } else {
            setFormData(initialFormState);
        }
    }, [selectedUser, isEditing, open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.user?.trim() && !isEditing) {
            newErrors.user = 'Username is required';
        }
        if (!formData.password?.trim() && !isEditing) {
            newErrors.password = 'Password is required';
        }
        if (!formData.fname?.trim()) {
            newErrors.fname = 'First name is required';
        }
        if (!formData.lname?.trim()) {
            newErrors.lname = 'Last name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const userData = { ...formData };
        if (isEditing && !userData.password) {
            delete userData.password;
        }

        const result = await onSubmit(userData);
        if (result?.success) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {isEditing ? 'Edit User' : 'Create New User'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="user"
                            value={formData.user}
                            onChange={handleChange}
                            disabled={isEditing}
                            error={!!errors.user}
                            helperText={errors.user}
                            required={!isEditing}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password || (!isEditing ? 'Required' : 'Leave blank to keep current')}
                            required={!isEditing}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="fname"
                            value={formData.fname}
                            onChange={handleChange}
                            error={!!errors.fname}
                            helperText={errors.fname}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Middle Name"
                            name="mname"
                            value={formData.mname}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lname"
                            value={formData.lname}
                            onChange={handleChange}
                            error={!!errors.lname}
                            helperText={errors.lname}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Position"
                            name="xPosi"
                            value={formData.xPosi}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Department"
                            name="xDept"
                            value={formData.xDept}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Access Level"
                            name="xlevel"
                            value={formData.xlevel}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Section"
                            name="xSection"
                            value={formData.xSection}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Multi Dept"
                            name="MULTI_DEPT"
                            value={formData.MULTI_DEPT}
                            onChange={handleChange}
                            helperText="(e.g., 'IT OFFICE|FINANCE')"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Multi App"
                            name="MULTI_APP"
                            value={formData.MULTI_APP}
                            onChange={handleChange}
                            helperText="(e.g., 'jo1|jo2')"
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Admin"
                                    checked={formData.Admin === 1}
                                    onChange={handleChange}
                                />
                            }
                            label="Admin"
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Log"
                                    checked={formData.Log === 1}
                                    onChange={handleChange}
                                />
                            }
                            label="Log"
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="Approver"
                                    checked={formData.Approver === 1}
                                    onChange={handleChange}
                                />
                            }
                            label="Approver"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={saving}
                    startIcon={saving}
                >
                    {saving ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}