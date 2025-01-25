package db

import (
	"context"
	"database/sql"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/stretchr/testify/require"
)

func createRandomAccount() (Account, CreateAccountParams, error) {

	args := CreateAccountParams{
		Owner:    gofakeit.Name(),
		Balance:  int64(gofakeit.Price(100, 1000)),
		Currency: gofakeit.CurrencyShort(),
	}

	account, err := testQueries.CreateAccount(context.Background(), args)

	return account, args, err
}

func TestCreateAccount(t *testing.T) {

	gofakeit.Seed(time.Now().UnixNano())

	account, args, err := createRandomAccount()

	require.NoError(t, err)
	require.NotEmpty(t, account)
	require.Equal(t, args.Owner, account.Owner)
	require.NotZero(t, account.ID)
	require.NotZero(t, account.CreatedAt)

}

func TestGetAccount(t *testing.T) {
	account, _, _ := createRandomAccount()
	account2, err := testQueries.GetAccount(context.Background(), account.ID)

	require.NoError(t, err)
	require.NotEmpty(t, account2)
	require.Equal(t, account.Owner, account2.Owner)
}

func TestUpdateAccount(t *testing.T) {
	account1, _, _ := createRandomAccount()

	arg := UpdateAccountParams{
		ID:      account1.ID,
		Balance: int64(gofakeit.Price(100, 1000)),
	}

	account2, err := testQueries.UpdateAccount(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, account2)

	require.Equal(t, account1.ID, account2.ID)
	require.Equal(t, account1.Owner, account2.Owner)
	require.Equal(t, arg.Balance, account2.Balance)
	require.Equal(t, account1.Currency, account2.Currency)
	require.WithinDuration(t, account1.CreatedAt, account2.CreatedAt, time.Second)
}

func TestDeleteAccount(t *testing.T) {
	account1, _, _ := createRandomAccount()

	err := testQueries.DeleteAccount(context.Background(), account1.ID)
	require.NoError(t, err)

	account2, err := testQueries.GetAccount(context.Background(), account1.ID)
	require.Error(t, err)
	require.EqualError(t, err, sql.ErrNoRows.Error())
	require.Empty(t, account2)
}

func TestListAccounts(t *testing.T) {
	var accounts []Account
	for i := 0; i < 10; i++ {
		tAccount, _, _ := createRandomAccount()
		accounts = append(accounts, tAccount)
	}

	arg := ListAccountsParams{
		Owner:  accounts[0].Owner,
		Limit:  5,
		Offset: 0,
	}

	accounts, err := testQueries.ListAccounts(context.Background(), arg)
	require.NoError(t, err)
	require.NotEmpty(t, accounts)

	for _, account := range accounts {
		require.NotEmpty(t, account)
		require.Equal(t, accounts[0].Owner, account.Owner)
	}
}
