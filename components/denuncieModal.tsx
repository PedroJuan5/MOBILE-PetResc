import React from 'react';
import { Modal, Text, View } from 'react-native';

interface DenuncieModalProps {
	visible: boolean;
	onClose: () => void;
}

export const DenuncieModal = ({ visible, onClose }: DenuncieModalProps) => {
	return (
		<Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<View style={{ backgroundColor: 'white', padding: 20, borderRadius: 8 }}>
					<Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Denuncie</Text>
					<Text>Informações de denúncia podem ser exibidas aqui.</Text>
				</View>
			</View>
		</Modal>
	);
};