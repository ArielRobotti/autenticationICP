import React from 'react';
// import { GoogleIcon, IntIdIcon } from '../Icons'
interface CustomModalProps {
	internetIdentityUrl: string;
	isOpen: boolean;
	onClose: () => void;
	onSelectProvider: (providerUrl: string) => void;
}

const ModalProviderSelect: React.FC<CustomModalProps> = ({ isOpen, internetIdentityUrl, onClose, onSelectProvider }) => {
	if (!isOpen) return null;
	return (
		<div className="modal-overlay" onClick={onClose}>
			<div 
				className="absolute top-[10px] right-auto sm:right-[10px] bg-[#222233] rounded-[10px] p-5 w-[350px]" 
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className='mb-10 text-white text-[20px] text-center'>Choose an Identity Provider</h2>
				<div className="button !h-10 !flex !mb-4 !items-center !justify-center" onClick={() => onSelectProvider(internetIdentityUrl)}>
					Internet Identity
				</div>
				<div
					className="button !h-10 !flex !flex-row !items-center !justify-center gap-1"
					onClick={() => onSelectProvider("https://nfid.one/authenticate/?applicationName=my-ic-app")}>
					<div className='text-[20px]'>NFID</div>
					{/* <GoogleIcon className='ml-6 mr-[-4px] '/> oogle */}
				</div>

			</div>
		</div>
	);
};

export default ModalProviderSelect;