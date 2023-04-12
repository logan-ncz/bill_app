import { screen } from "@testing-library/dom"
import { } from "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import Bills from "../containers/Bills.js"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import localStorageMock from "../__mocks__/localStorage.js"
import store from "../__mocks__/store"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import Router from "../app/Router"


describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    // Create a replica of the localStorage object, because we are not in a browser
    Object.defineProperty(window, localStorage, {value: localStorageMock});
    // Ok now that we have a localStorage, we can use it to set an user
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
      })
    );
    // Set the current window location to the right path/adress. Like : http://127.0.0.1:8080/#employee/bills in the browser
    Object.defineProperty(window, "location", {
      value: {
        hash: ROUTES_PATH["Bills"],
      },
    });
  });

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      document.body.innerHTML = `<div id="root"></div>`;
      await Router();
      //to-do write expect expression
      expect(screen.getByTestId("icon-window")).toHaveClass("active-icon");
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    describe("and the new bill button is pressed", () => {
      test("Then the new Bill page should be displayed", () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const bills = new Bills({document, onNavigate, store, localStorage});
        const handleClickNewBill = jest.fn((e) => bills.handleClickNewBill(e));
        const addnewBill = screen.getByTestId('btn-new-bill');
        addnewBill.addEventListener("click", handleClickNewBill);
        userEvent.click(addnewBill);
        expect(handleClickNewBill).toHaveBeenCalled();
      });
    })
  })

    describe("and the icon eye button is pressed", () => {
      test("The modal display", () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html
        const store = null
        const bills1 = new Bills({
          document, onNavigate, store, localStorage: window.localStorage
        });
        const handleClickIconEye = jest.fn(bills1.handleClickIconEye);
        $.fn.modal = jest.fn();
        const iconEyes = screen.getAllByTestId('icon-eye');
        const iconEye = iconEyes[1]
        iconEye.addEventListener('click', handleClickIconEye(iconEye));
        userEvent.click(iconEye);
        expect(handleClickIconEye).toHaveBeenCalled();
      })
    })
})
  

// test d'intégration GET
describe("Given I am a user connected as Admin", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(store, "get")
      const bills = await store.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      store.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})