import AccountForm from '@/components/account/AccountForm'
import { Metadata } from 'next';
import React from 'react'

const pageTitle = "Account";

export const metadata: Metadata = {
  title: pageTitle,
};

const AccountPage = () => {
  return (
    <div>
      <AccountForm />
    </div>
  )
}

export default AccountPage